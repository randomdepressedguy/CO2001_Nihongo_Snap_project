'use client';
import { useRef, useState } from 'react';
import { Check, Cloud, Download, FileUp, LoaderCircle, ShieldCheck, Volume2 } from 'lucide-react';
import { validateState } from '@/lib/study/core';
import { useStudy } from './context';
import { Modal } from './shared';
import { downloadJSON } from './Vocabulary';
export function StudySettings({ close }: {
    close: () => void;
}) {
    const { s, set, t, notify, speak, status, backup } = useStudy();
    const [busy, setBusy] = useState(false);
    const [restore, setRestore] = useState<'cloud' | 'file' | null>(null);
    const file = useRef<HTMLInputElement>(null);
    async function cloud(mode: 'save' | 'restore') { if (busy)
        return; setBusy(true); await backup(mode); setBusy(false); setRestore(null); }
    async function restoreFile(selected?: File) { if (!selected)
        return; try {
        if (selected.size > 10 * 1024 * 1024)
            throw Error();
        const next = validateState(JSON.parse(await selected.text()));
        set(() => next);
        notify(t('Đã khôi phục từ tệp, gồm cả lịch ôn và ghi chú.', 'Restored words, review schedules and notes from file.'));
        setRestore(null);
    }
    catch {
        notify(t('Tệp không hợp lệ. Hãy chọn bản sao Nihongo Snap phiên bản 2, tối đa 10 MB.', 'Invalid file. Choose a version 2 Nihongo Snap backup, up to 10 MB.'));
    } if (file.current)
        file.current.value = ''; }
    return <Modal title={t('Cài đặt học tập', 'Study settings')} close={close}>
    <div className="settings-section"><h3>{t('Cách hiển thị', 'Display preferences')}</h3><label>{t('Ngôn ngữ giao diện', 'Interface language')}<select value={s.settings.lang} onChange={e => set(x => ({ ...x, settings: { ...x.settings, lang: e.target.value as 'vi' | 'en' } }))}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label><label className="toggle-row"><span><strong>{t('Hiện cách đọc kana', 'Show kana readings')}</strong><small>{t('Hiển thị furigana trên thẻ từ vựng.', 'Show furigana on vocabulary cards.')}</small></span><input type="checkbox" role="switch" checked={s.settings.furigana} onChange={e => set(x => ({ ...x, settings: { ...x.settings, furigana: e.target.checked } }))}/></label><label className="toggle-row"><span><strong>{t('Hiện romaji', 'Show romaji')}</strong><small>{t('Hỗ trợ nhận diện cách đọc kana.', 'A reading aid while you learn kana.')}</small></span><input type="checkbox" role="switch" checked={s.settings.romaji} onChange={e => set(x => ({ ...x, settings: { ...x.settings, romaji: e.target.checked } }))}/></label><button className="btn secondary" onClick={() => speak('こんにちは。少しずつ、日本語を勉強しましょう。')}><Volume2 size={17}/>{t('Thử giọng đọc Nhật', 'Test Japanese voice')}</button><p className="hint">{t('Giọng đọc do thiết bị cung cấp; có thể cần cài giọng ja-JP trong hệ điều hành.', 'Speech uses your device’s voices. A ja-JP voice may need to be installed.')}</p></div>
    <div className="settings-section"><h3><ShieldCheck size={19}/>{t('Giữ những từ đã học', 'Data backup')}</h3><p>{t('Từ vựng và lịch ôn tự lưu trên trình duyệt này. Xuất một bản sao để chuyển máy hoặc giữ dữ liệu lâu dài.', 'Words and schedules save automatically in this browser. Export a copy to move devices or keep a lasting backup.')}</p><div className="row wrap"><button className="btn secondary" onClick={() => downloadJSON(s, 'nihongo-snap-backup.json')}><Download size={17}/>{t('Xuất bản sao JSON', 'Export JSON backup')}</button><button className="btn secondary" onClick={() => setRestore('file')}><FileUp size={17}/>{t('Khôi phục từ tệp', 'Restore from file')}</button><input hidden type="file" ref={file} accept=".json,application/json" onChange={e => restoreFile(e.target.files?.[0])}/></div><p className="hint">{t('Chỉ muốn nhập thêm từ? Dùng “Nhập từ” trong Sổ tay để giữ nguyên dữ liệu hiện có.', 'Just adding words? Use Import in Notebook to keep existing data.')}</p>
    {restore === 'file' && <div className="notice"><strong>{t('Khôi phục sẽ thay thế dữ liệu trên thiết bị.', 'Restore replaces data on this device.')}</strong><p>{t('Hãy xuất bản sao hiện tại trước nếu cần. Chọn tệp để tiếp tục.', 'Export your current data first if needed. Then choose a file.')}</p><button className="btn" onClick={() => file.current?.click()}>{t('Chọn bản sao để khôi phục', 'Choose backup to restore')}</button><button className="text-btn" onClick={() => setRestore(null)}>{t('Hủy', 'Cancel')}</button></div>}
    </div>
    <div className="settings-section"><h3><Cloud size={19}/>{t('Bản sao đám mây', 'Cloud backup')}</h3><p>{t('Tài khoản tự đồng bộ từ vựng và lịch ôn. Khi có xung đột, xuất bản thiết bị trước khi tải bản máy chủ.', 'Accounts automatically synchronize words and review dates. Export the device copy before loading server data when resolving conflicts.')}</p>{status.cloud && status.user ? <><div className="row wrap"><button className="btn secondary" disabled={busy} onClick={() => cloud('save')}>{busy ? <LoaderCircle className="spin" size={17}/> : <Cloud size={17}/>}{t('Đồng bộ ngay', 'Synchronize now')}</button><button className="btn secondary" disabled={busy} onClick={() => setRestore('cloud')}>{t('Tải bản máy chủ', 'Load server copy')}</button></div>{restore === 'cloud' && <div className="notice"><p>{t('Bản trên thiết bị sẽ được thay bằng bản máy chủ. Nên xuất bản sao JSON trước khi tiếp tục.', 'Device data will be replaced by the cloud copy. Export a backup before continuing.')}</p><button className="btn" disabled={busy} onClick={() => cloud('restore')}>{t('Khôi phục bản sao', 'Restore backup')}</button><button className="text-btn" onClick={() => setRestore(null)}>{t('Hủy', 'Cancel')}</button></div>}</> : <p className="notice">{t('Đăng nhập để đồng bộ tài khoản. Có thể xuất và nhập tệp JSON ở chế độ khách.', 'Cloud backup needs a signed-in account and available storage. JSON backup works independently.')}</p>}</div>
    <button className="btn full" onClick={close}><Check size={17}/>{t('Hoàn tất', 'Done')}</button>
  </Modal>;
}
