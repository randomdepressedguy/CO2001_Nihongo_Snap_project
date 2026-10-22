'use client';
import Link from './NavigationLink';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { safeReturnPath } from '@/lib/auth/validation';
import { useStudy } from './context';
export function AuthPage({ mode }: {
    mode: 'login' | 'register';
}) {
    const { t } = useStudy();
    const query = useSearchParams();
    const registering = mode === 'register';
    const [visible, setVisible] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', remember: false });
    const next = safeReturnPath(query.get('next'));
    async function submit(event: React.FormEvent) { event.preventDefault(); if (busy)
        return; setError(''); if (registering && form.password !== form.confirm) {
        setError(t('Mật khẩu xác nhận chưa khớp.', 'The passwords do not match.'));
        return;
    } setBusy(true); try {
        const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password, remember: form.remember }), signal: AbortSignal.timeout(20000) });
        const data = await response.json() as {
            error?: string;
        };
        if (!response.ok)
            throw Error(data.error || t('Chưa hoàn tất. Vui lòng thử lại.', 'Please try again.'));
        location.assign(next);
    }
    catch (error) {
        setError(error instanceof Error && error.name !== 'TimeoutError' ? error.message : t('Kết nối chậm hoặc bị gián đoạn. Vui lòng thử lại.', 'The connection timed out. Please try again.'));
        setBusy(false);
    } }
    return <section className="auth-page"><div className="auth-sheet"><div className="auth-form-panel"><span className="eyebrow">{registering ? '新規登録 · CREATE AN ACCOUNT' : 'ログイン · SIGN IN'}</span><h1>{registering ? t('Tạo tài khoản', 'Create an account') : t('Đăng nhập', 'Sign in')}</h1><p className="auth-intro">{registering ? t('Lưu từ vựng, ghi chú và lịch ôn theo tài khoản.', 'Keep vocabulary, notes and review dates with an account.') : t('Tiếp tục học với bộ thẻ và lịch ôn đã lưu.', 'Continue with saved decks and review schedules.')}</p>
    <form className="form" onSubmit={submit}>
      {registering && <label>{t('Tên hiển thị', 'Display name')}<input autoComplete="nickname" required minLength={2} maxLength={40} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('Nhập tên hiển thị', 'Enter a display name')}/></label>}
      <label>Email<input type="email" autoComplete="email" inputMode="email" required maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ten@example.com"/></label>
      <label>{t('Mật khẩu', 'Password')}<span className="password-field"><input type={visible ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 12 : 1} maxLength={128} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={registering ? t('Từ 12 ký tự', 'At least 12 characters') : t('Nhập mật khẩu', 'Enter a password')}/><button type="button" className="icon-btn" aria-label={visible ? t('Ẩn mật khẩu', 'Hide password') : t('Hiện mật khẩu', 'Show password')} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>
      {registering && <label>{t('Xác nhận mật khẩu', 'Confirm password')}<input type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder={t('Nhập lại mật khẩu', 'Repeat the password')}/></label>}
      {!registering && <label className="remember-row"><input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })}/><span>{t('Giữ đăng nhập trong 30 ngày', 'Stay signed in for 30 days')}</span></label>}
      {error && <p className="inline-error" role="alert">{error}</p>}
      <button className="btn full" disabled={busy} type="submit">{busy ? t('Đang xử lý…', 'Processing…') : registering ? t('Tạo tài khoản', 'Create account') : t('Đăng nhập', 'Sign in')}{!busy && <ArrowRight size={17}/>}</button>
    </form>
    <p className="auth-switch">{registering ? t('Đã có tài khoản?', 'Already registered?') : t('Chưa có tài khoản?', 'New to Nihongo Snap?')} <Link href={`${registering ? '/login' : '/register'}?next=${encodeURIComponent(next)}`}>{registering ? t('Đăng nhập', 'Sign in') : t('Đăng ký', 'Create an account')}</Link></p>
    <div className="auth-service-note"><LockKeyhole size={16}/><p>{t('Email dùng làm tên đăng nhập. Hiện chưa hỗ trợ đăng nhập Google hoặc đặt lại mật khẩu qua email.', 'Email is the sign-in identifier. Google sign-in and email password reset are not enabled yet.')}</p></div>
    <Link className="auth-guest" href="/cards">{t('Tiếp tục ở chế độ khách', 'Continue as guest')}<ArrowRight size={15}/></Link>
  </div><aside className="auth-art"><div><span className="jp" lang="ja">学びを、<br />日々に。</span><p>{t('Từ ngữ được ghi lại.\nKiến thức được giữ lâu.', 'Words collected.\nKnowledge remembered.')}</p><span className="auth-seal jp" lang="ja">日本語</span></div></aside></div></section>;
}
