'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { defaultState, type State, type Word, type Card, makeCard, normalize, validateState } from '@/lib/study/core';
import { importCollection } from '@/lib/study/collection';
import { selectInitialState, type SyncMeta } from '@/lib/study/sync';

export type PublicAccount = { id: string; name: string; email: string; createdAt: string };
export type StudyStatus = { ai: boolean; cloud: boolean; user: PublicAccount | null; localKey?: string; legacyKey?: string | null };
type SyncStatus = 'local' | 'loading' | 'saving' | 'synced' | 'offline' | 'conflict' | 'reauth';
type Ctx = {
  s: State; set: (f: (s: State) => State) => void; t: (vi: string, en: string) => string;
  notify: (message: string) => void; save: (word: Word, deck?: string, image?: string) => void;
  speak: (text: string, slow?: boolean) => void; status: StudyStatus; ready: boolean;
  storage: 'saving' | 'saved' | 'error'; syncStatus: SyncStatus; retrySave: () => void;
  loadError: boolean; recovery: unknown; toast: string;
  backup: (mode: 'save' | 'restore') => Promise<void>; clear: () => Promise<void>;
  importLegacy: () => Promise<void>;
  navigate: (href: string) => Promise<void>;
};
const Context = createContext<Ctx>(null!);
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const request = indexedDB.open('nihongo-snap-v2', 1); request.onupgradeneeded = () => request.result.createObjectStore('study'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); request.onblocked = () => reject(Error('Storage unavailable')); });
}
async function readCache(key: string) {
  const db = await openDB();
  return new Promise<{ raw: unknown; meta: SyncMeta | null }>((resolve, reject) => {
    const transaction = db.transaction('study', 'readonly'); const store = transaction.objectStore('study');
    const state = store.get(key); const meta = store.get(`${key}:sync`);
    transaction.oncomplete = () => { db.close(); resolve({ raw: state.result, meta: meta.result ?? null }); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
async function writeCache(key: string, state: State, meta: SyncMeta) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => { const transaction = db.transaction('study', 'readwrite'); const store = transaction.objectStore('study'); store.put(state, key); store.put(meta, `${key}:sync`); transaction.oncomplete = () => { db.close(); resolve(); }; transaction.onerror = () => { db.close(); reject(transaction.error); }; });
}
class SyncRequestError extends Error { constructor(public status: number, message: string) { super(message); } }
async function remoteState() {
  const response = await fetch('/api/state', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  const data = await response.json() as { state?: unknown; revision: number; error?: string };
  if (!response.ok) throw new SyncRequestError(response.status, data.error || 'Không đọc được dữ liệu tài khoản.');
  return { state: data.state ? validateState(data.state) : null, revision: data.revision };
}
const emptyStatus: StudyStatus = { ai: false, cloud: false, user: null };
export function StudyProvider({ children, initialStatus }: { children: React.ReactNode; initialStatus?: StudyStatus }) {
  const [s, setS] = useState<State>(defaultState); const current = useRef(s); current.current = s;
  const [status, setStatus] = useState(initialStatus ?? emptyStatus);
  const [ready, setReady] = useState(false); const [loadError, setLoadError] = useState(false); const [recovery, setRecovery] = useState<unknown>();
  const [storage, setStorage] = useState<'saving' | 'saved' | 'error'>('saved'); const [syncStatus, setSyncStatus] = useState<SyncStatus>(initialStatus?.user ? 'loading' : 'local');
  const [toast, setToast] = useState(''); const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = useRef('guest'); const revision = useRef<number | null>(null); const canPersist = useRef(true); const writes = useRef(Promise.resolve());
  const firstPersist = useRef(true); const sequence = useRef(0); const cloudRunning = useRef(false); const blocked = useRef(false); const dirty = useRef(false);
  const legacy = useRef<string | null>(null); const accountRef = useRef(false);
  const [retry, setRetry] = useState(0);
  function notify(message: string) { setToast(message); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 5000); }
  const t = (vi: string, en: string) => s.settings.lang === 'vi' ? vi : en;
  function cache(snapshot: State, pending: boolean) {
    const n = ++sequence.current; setStorage('saving');
    const task = writes.current.catch(() => {}).then(() => writeCache(key.current, snapshot, { revision: revision.current, pending }));
    writes.current = task;
    return task.then(() => { if (sequence.current === n) setStorage('saved'); }, () => { if (sequence.current === n) { setStorage('error'); notify('Không lưu được trên thiết bị. Xuất bản sao JSON để giữ dữ liệu.'); } });
  }
  async function syncNow() {
    if (!accountRef.current || cloudRunning.current || blocked.current || !canPersist.current) return;
    cloudRunning.current = true;
    try {
      if (revision.current === null) {
        const remote = await remoteState();
        if (remote.revision > 0) { blocked.current = true; setSyncStatus('conflict'); return; }
        revision.current = 0;
      }
      while (dirty.current && !blocked.current) {
        const snapshot = current.current; setSyncStatus('saving');
        const response = await fetch('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000), body: JSON.stringify({ state: snapshot, revision: revision.current }) });
        const data = await response.json() as { revision?: number; error?: string };
        if (response.status === 409) { blocked.current = true; setSyncStatus('conflict'); await cache(current.current, true); return; }
        if (!response.ok || typeof data.revision !== 'number') throw new SyncRequestError(response.status, data.error || 'Không đồng bộ được.');
        revision.current = data.revision;
        dirty.current = current.current !== snapshot;
        await cache(current.current, dirty.current);
      }
      if (!blocked.current) setSyncStatus('synced');
    } catch (error) { setSyncStatus(error instanceof SyncRequestError && error.status === 401 ? 'reauth' : 'offline'); }
    finally { cloudRunning.current = false; }
  }
  useEffect(() => {
    let active = true;
    (async () => {
      let st = initialStatus ?? emptyStatus;
      if (!initialStatus) { try { const response = await fetch('/api/status', { signal: AbortSignal.timeout(8000) }); if (response.ok) st = await response.json() as StudyStatus; } catch {} }
      if (!active) return;
      key.current = st.localKey ?? (st.user ? `account:${st.user.id}` : 'guest');
      accountRef.current = !!st.user; legacy.current = st.legacyKey ?? null; setStatus(st);
      let local: State | null = null; let meta: SyncMeta | null = null;
      try { const cached = await readCache(key.current); if (!active) return; setRecovery(cached.raw); local = cached.raw ? validateState(cached.raw) : null; meta = cached.meta; }
      catch { if (active) { canPersist.current = false; setLoadError(true); setStorage('error'); setReady(true); } return; }
      let selected = local ?? defaultState();
      if (st.user) {
        try {
          const remote = await remoteState(); if (!active) return;
          const decision = selectInitialState(local, meta, remote.state, remote.revision);
          selected = decision.state ?? selected; revision.current = decision.revision;
          blocked.current = decision.conflict; dirty.current = decision.pending;
          setSyncStatus(decision.conflict ? 'conflict' : decision.pending ? 'saving' : 'synced');
        } catch (error) { revision.current = meta?.revision ?? null; dirty.current = !!meta?.pending; setSyncStatus(error instanceof SyncRequestError && error.status === 401 ? 'reauth' : 'offline'); }
      } else setSyncStatus('local');
      if (!active) return;
      current.current = selected; setS(selected); await writeCache(key.current, selected, { revision: revision.current, pending: dirty.current }).catch(() => setStorage('error'));
      if (active) setReady(true);
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready || !canPersist.current) return;
    if (firstPersist.current) { firstPersist.current = false; if (dirty.current) void syncNow(); return; }
    dirty.current = !!status.user;
    void cache(s, dirty.current);
    if (status.user) { const timer = setTimeout(() => { void syncNow(); }, 650); return () => clearTimeout(timer); }
  }, [s, ready, retry]);
  useEffect(() => { document.documentElement.lang = s.settings.lang; }, [s.settings.lang]);
  useEffect(() => { const online = () => { void syncNow(); }; window.addEventListener('online', online); return () => window.removeEventListener('online', online); });
  const set = (update: (value: State) => State) => setS(value => update(value));
  function save(word: Word, deck = s.decks[0], image?: string) {
    const duplicate = (c: Card) => c.deck === deck && normalize(c.jp) === normalize(word.jp) && normalize(c.kana) === normalize(word.kana);
    if (s.cards.some(duplicate)) { notify(t('Từ đã có trong bộ thẻ.', 'Already saved in this deck.')); return; }
    const card = { ...makeCard(word, deck), image };
    set(value => value.cards.some(duplicate) ? value : { ...value, cards: [...value.cards, card] }); notify(t('Đã lưu vào ', 'Saved in ') + deck);
  }
  function speak(text: string, slow = false) {
    if (!('speechSynthesis' in window)) { notify(t('Trình duyệt chưa hỗ trợ phát âm.', 'Speech is unavailable.')); return; }
    const voices = speechSynthesis.getVoices(); const voice = voices.find(v => v.lang.startsWith('ja'));
    if (voices.length && !voice) { notify(t('Thiết bị chưa có giọng Nhật. Có thể cài giọng ja-JP trong hệ điều hành.', 'No Japanese voice is installed. Add a ja-JP voice in system settings.')); return; }
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = slow ? .65 : .85; if (voice) utterance.voice = voice;
    utterance.onerror = event => { if (!['interrupted','canceled'].includes(event.error)) notify(t('Không phát được âm thanh.', 'Audio could not play.')); }; speechSynthesis.speak(utterance);
  }
  async function backup(mode: 'save' | 'restore') {
    if (mode === 'save' && status.user) { await syncNow(); return; }
    try {
      if (mode === 'restore') {
        if (cloudRunning.current) { notify(t('Đang đồng bộ. Vui lòng thử lại sau.', 'Sync is in progress. Try again shortly.')); return; }
        const remote = await remoteState(); if (!remote.state) { notify(t('Chưa có bản sao trên máy chủ.', 'No server copy is available.')); return; }
        revision.current = remote.revision; blocked.current = false; dirty.current = false; current.current = remote.state;
        await cache(remote.state, false); setS(remote.state); setSyncStatus(status.user ? 'synced' : 'local'); notify(t('Đã tải dữ liệu từ máy chủ.', 'Server data loaded.'));
      } else {
        if (revision.current === null) { const remote = await remoteState(); if (remote.revision > 0) { notify(t('Đã có bản sao trên máy chủ. Cần khôi phục trước khi ghi bản mới.', 'A server copy exists. Restore before replacing it.')); return; } revision.current = 0; }
        const response = await fetch('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: revision.current, state: current.current }), signal: AbortSignal.timeout(15000) });
        const data = await response.json() as { revision: number; error?: string }; if (!response.ok) throw Error(data.error); revision.current = data.revision; notify(t('Đã lưu bản sao trên máy chủ.', 'Server backup saved.'));
      }
    } catch { notify(t('Chưa truy cập được dữ liệu máy chủ. Bản lưu trên thiết bị vẫn được giữ.', 'Server data is unavailable. The device copy is preserved.')); }
  }
  async function importLegacy() {
    if (!status.user || !legacy.current || legacy.current === key.current) return;
    try { const cached = await readCache(legacy.current); if (!cached.raw) { notify(t('Không có dữ liệu cũ trên thiết bị.', 'No previous device data found.')); return; } const imported = validateState(cached.raw); const next = importCollection(current.current, imported); setS(next); notify(t(`Đã nhập ${next.cards.length - current.current.cards.length} từ cũ.`, 'Previous device words imported.')); } catch { notify(t('Không đọc được dữ liệu cũ. Có thể nhập từ tệp JSON.', 'Previous data could not be read. Import a JSON backup instead.')); }
  }
  async function navigate(href: string) {
    // Do not replace a cache that has not been read or failed validation.
    if (ready && canPersist.current) await cache(current.current, dirty.current);
    location.assign(href);
  }
  async function clear() { const fresh = defaultState(); fresh.settings = s.settings; setS(fresh); }
  return <Context.Provider value={{ s, set, t, notify, save, speak, status, ready, storage, syncStatus, loadError, recovery, toast, backup, clear, importLegacy, navigate, retrySave: () => { setRetry(n => n + 1); void syncNow(); } }}>{children}{toast && <div className="toast" role="status">{toast}</div>}</Context.Provider>;
}
export const useStudy = () => useContext(Context);
export function useStudyClock() { const start = useRef(Date.now()); return () => { const elapsed = Math.floor((Date.now() - start.current) / 1000); start.current = Date.now(); return Math.max(1, Math.min(300, elapsed)); }; }
