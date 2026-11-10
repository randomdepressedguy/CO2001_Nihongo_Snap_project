'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { LoaderCircle, MessageCircle, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from './NavigationLink';
import { useStudy } from './context';

export function ChatWidget() {
  const { s, set, t, status, ready, loadError } = useStudy();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
      inputRef.current?.focus();
    }
  }, [open, s.chat.length, busy]);

  if (pathname === '/login' || pathname === '/register' || !ready || loadError) return null;

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy || !status.user || !status.ai) return;
    const history = [...s.chat, { role: 'user' as const, text: message }].slice(-29);
    setDraft('');
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'tutor', messages: history, level: s.settings.level, lang: s.settings.lang, scenario: 'free' }),
        signal: AbortSignal.timeout(50000),
      });
      const data = await response.json() as { text?: string; error?: string };
      if (!response.ok || !data.text) throw new Error(data.error || t('Chưa nhận được câu trả lời.', 'No answer received.'));
      set(current => ({ ...current, chat: [...history, { role: 'model' as const, text: data.text! }].slice(-40) }));
    } catch (cause) {
      setDraft(message);
      setError(cause instanceof Error ? cause.message : t('Không gửi được câu hỏi. Hãy thử lại.', 'Could not send the question. Please retry.'));
    } finally {
      setBusy(false);
    }
  }

  return <div className="chat-widget">
    {open && <section className="chat-panel" id="chat-panel" aria-label={t('Trợ lý tiếng Nhật', 'Japanese tutor')}>
      <header className="chat-panel-head"><div className="chat-avatar jp" lang="ja">花</div><div><strong>Hana</strong><small>{t('Hỏi nhanh về tiếng Nhật', 'Quick Japanese help')}</small></div><button type="button" aria-label={t('Đóng trò chuyện', 'Close chat')} onClick={() => setOpen(false)}><X size={19}/></button></header>
      <div className="chat-messages" ref={messagesRef} aria-live="polite">
        {s.chat.length === 0 && <div className="chat-welcome"><span className="jp" lang="ja">こんにちは！</span><p>{t('Mình có thể giải thích từ vựng, mẫu câu hoặc giúp bạn luyện một đoạn hội thoại ngắn.', 'Ask me about vocabulary, grammar, or a short conversation.')}</p>{status.user && status.ai && <button type="button" onClick={() => { setDraft(t('Hãy dạy mình 3 câu chào hỏi tiếng Nhật cơ bản.', 'Teach me 3 basic Japanese greetings.')); inputRef.current?.focus(); }}>{t('Thử hỏi về câu chào', 'Try a greeting question')}</button>}</div>}
        {s.chat.map((message, index) => <div key={index} className={`chat-bubble ${message.role === 'user' ? 'from-user' : 'from-hana'}`}><span>{message.role === 'user' ? t('Bạn', 'You') : 'Hana'}</span><p>{message.role === 'model' ? message.text.replace(/\*\*/g, '') : message.text}</p></div>)}
        {busy && <div className="chat-typing" role="status"><LoaderCircle size={17} className="spin"/>{t('Hana đang trả lời…', 'Hana is replying…')}</div>}
      </div>
      {!status.user ? <div className="chat-access"><p>{t('Đăng nhập để hỏi Hana và lưu hội thoại.', 'Sign in to ask Hana and save the conversation.')}</p><Link className="btn" href={`/login?next=${encodeURIComponent(pathname)}`}>{t('Đăng nhập', 'Sign in')}</Link></div> : !status.ai ? <div className="chat-access"><p>{t('Trợ lý AI chưa được cấu hình trên máy chủ.', 'The AI tutor is not configured on the server.')}</p></div> : <form className="chat-compose" onSubmit={send}><label className="sr-only" htmlFor="chat-question">{t('Câu hỏi cho Hana', 'Question for Hana')}</label><textarea id="chat-question" ref={inputRef} rows={2} maxLength={2000} placeholder={t('Hỏi về một từ hoặc mẫu câu…', 'Ask about a word or phrase…')} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }}/><button type="submit" disabled={!draft.trim() || busy} aria-label={t('Gửi câu hỏi', 'Send question')}><Send size={18}/></button></form>}
      {error && <p className="chat-error" role="alert">{error}</p>}
      <small className="chat-footnote">{t('AI có thể nhầm; hãy kiểm tra thông tin quan trọng.', 'AI can make mistakes; verify important details.')}</small>
    </section>}
    <button className="chat-launcher" type="button" aria-label={open ? t('Đóng trợ lý Hana', 'Close Hana tutor') : t('Mở trợ lý Hana', 'Open Hana tutor')} aria-expanded={open} aria-controls="chat-panel" onClick={() => setOpen(value => !value)}>{open ? <X size={23}/> : <MessageCircle size={24}/>}<span>{open ? t('Đóng', 'Close') : t('Hỏi Hana', 'Ask Hana')}</span></button>
  </div>;
}
