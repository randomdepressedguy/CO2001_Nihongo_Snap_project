'use client';
import Link from './NavigationLink';
import { useState } from 'react';
import { ArrowRight, Check, Cloud, Download, Import, KeyRound, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useStudy, type PublicAccount } from './context';
import { downloadJSON } from './Vocabulary';
import { StudySettings } from './StudySettings';
export function AccountPage({ account }: {
    account: PublicAccount;
}) {
    const { s, t, ready, storage, syncStatus, backup, retrySave, importLegacy } = useStudy();
    const [name, setName] = useState(account.name);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [settings, setSettings] = useState(false);
    const [restore, setRestore] = useState(false);
    async function action(kind: 'profile' | 'password' | 'logout', body: unknown) { if (busy)
        return; setError(''); setMessage(''); if (kind === 'password' && passwords.newPassword !== passwords.confirm) {
        setError(t('Mật khẩu xác nhận chưa khớp.', 'The new passwords do not match.'));
        return;
    } setBusy(kind); try {
        const response = await fetch('/api/auth/' + kind, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
        const data = await response.json() as {
            error?: string;
        };
        if (!response.ok)
            throw Error(data.error || t('Yêu cầu chưa hoàn tất.', 'The request could not complete.'));
        if (kind === 'logout') {
            location.assign('/');
            return;
        }
        if (kind === 'profile') {
            location.reload();
            return;
        }
        setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
        setMessage(t('Đã đổi mật khẩu và kết thúc các phiên đăng nhập cũ.', 'Password updated. Previous sessions have ended.'));
    }
    catch (error) {
        setError(error instanceof Error ? error.message : t('Kết nối bị gián đoạn.', 'Connection interrupted.'));
    }
    finally {
        setBusy('');
    } }
    const syncText = ({ local: ['Lưu trên thiết bị', 'Device storage'], loading: ['Đang tải dữ liệu tài khoản', 'Loading account data'], saving: ['Đang đồng bộ', 'Synchronizing'], synced: ['Đã đồng bộ', 'Synchronized'], offline: ['Chờ kết nối để đồng bộ', 'Waiting for a connection'], conflict: ['Có xung đột dữ liệu', 'Sync conflict'], reauth: ['Cần đăng nhập lại để đồng bộ', 'Sign in again to synchronize'] } as const)[syncStatus];
    return <div className="feature-page account-page"><div className="page-trail"><Link href="/">{t('Trang chủ', 'Home')}</Link><span>/</span><span>{t('Tài khoản', 'Account')}</span><span className="page-trail-jp jp">アカウント</span></div><div className="account-heading"><div className="account-avatar">{account.name.slice(0, 1).toUpperCase()}</div><div><span className="eyebrow">学習アカウント · STUDY ACCOUNT</span><h1>{t('Quản lý tài khoản', 'Account settings')}</h1><p>{account.email}</p></div><button className="btn secondary" disabled={!!busy} onClick={() => action('logout', {})}><LogOut size={17}/>{busy === 'logout' ? t('Đang đăng xuất…', 'Signing out…') : t('Đăng xuất', 'Sign out')}</button></div>
    {message && <p className="account-success" role="status"><Check size={18}/>{message}</p>}{error && <p className="inline-error" role="alert">{error}</p>}
    <div className="account-grid"><section className="account-panel"><h2><UserRound size={21}/>{t('Thông tin cơ bản', 'Profile')}</h2><form className="form" onSubmit={e => { e.preventDefault(); void action('profile', { name }); }}><label>{t('Tên hiển thị', 'Display name')}<input required minLength={2} maxLength={40} autoComplete="nickname" value={name} onChange={e => setName(e.target.value)}/></label><label>Email<input type="email" value={account.email} readOnly/></label><p className="hint">{t('Ngày tạo tài khoản: ', 'Account created: ')}{new Date(account.createdAt).toLocaleDateString(s.settings.lang === 'vi' ? 'vi-VN' : 'en-GB')}</p><button className="btn" disabled={!!busy || name.trim() === account.name}>{busy === 'profile' ? t('Đang lưu…', 'Saving…') : t('Lưu thông tin', 'Save profile')}</button></form></section>
    <section className="account-panel sync-panel"><h2><Cloud size={21}/>{t('Dữ liệu học tập', 'Study data')}</h2><div className={`sync-state ${syncStatus}`}><span className="status-dot"/><strong>{t(syncText[0], syncText[1])}</strong></div><p>{t('Từ vựng, ghi chú và lịch ôn được tự động lưu theo tài khoản. Bản trên thiết bị hỗ trợ khi kết nối gián đoạn.', 'Vocabulary, notes and review dates save automatically to the account. A device copy supports interrupted connections.')}</p><div className="account-counts"><span><strong>{ready ? s.cards.length : '—'}</strong>{t('từ đã lưu', 'saved words')}</span><span><strong>{ready ? s.decks.length : '—'}</strong>{t('bộ thẻ', 'decks')}</span></div>
    {syncStatus === 'conflict' && <div className="notice"><strong>{t('Máy chủ có thay đổi từ phiên khác.', 'The server has changes from another session.')}</strong><p>{t('Xuất bản trên thiết bị trước khi tải bản máy chủ. Có thể nhập lại từ tệp JSON trong Sổ tay; thao tác nhập không ghi đè từ đã tồn tại.', 'Export the device copy before loading the server copy. Words can then be imported through Notebook; existing words are not overwritten.')}</p></div>}
    <div className="row wrap"><button className="btn secondary" disabled={!ready} onClick={() => downloadJSON(s, 'nihongo-snap-backup.json')}><Download size={17}/>{t('Xuất bản sao', 'Export backup')}</button><button className="btn secondary" disabled={!ready || syncStatus === 'saving'} onClick={retrySave}>{t('Đồng bộ lại', 'Retry sync')}</button><button className="text-btn" onClick={() => setRestore(!restore)}>{t('Tải bản máy chủ…', 'Load server copy…')}</button></div>{restore && <div className="notice"><p>{t('Bản trên thiết bị sẽ được thay bằng bản máy chủ. Xuất bản sao trước khi tiếp tục.', 'The device copy will be replaced by the server copy. Export a backup first.')}</p><button className="btn" onClick={async () => { await backup('restore'); setRestore(false); }}>{t('Xác nhận tải bản máy chủ', 'Load server copy')}</button><button className="text-btn" onClick={() => setRestore(false)}>{t('Hủy', 'Cancel')}</button></div>}
    <p className="device-state">{storage === 'saved' ? t('Bản trên thiết bị đã lưu.', 'Device copy saved.') : storage === 'saving' ? t('Đang lưu bản thiết bị…', 'Saving device copy…') : t('Chưa lưu được trên thiết bị. Nên xuất bản sao JSON.', 'Device copy could not save. Export a JSON backup.')}</p>
    </section>
    <section className="account-panel"><h2><KeyRound size={21}/>{t('Đổi mật khẩu', 'Change password')}</h2><form className="form" onSubmit={e => { e.preventDefault(); void action('password', passwords); }}><label>{t('Mật khẩu hiện tại', 'Current password')}<input type="password" autoComplete="current-password" required maxLength={128} value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}/></label><label>{t('Mật khẩu mới', 'New password')}<input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}/></label><label>{t('Xác nhận mật khẩu mới', 'Confirm new password')}<input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}/></label><p className="hint">{t('Từ 12 đến 128 ký tự. Đổi mật khẩu sẽ kết thúc các phiên đăng nhập cũ.', '12–128 characters. Changing the password ends previous sessions.')}</p><button className="btn" disabled={!!busy}>{busy === 'password' ? t('Đang cập nhật…', 'Updating…') : t('Đổi mật khẩu', 'Update password')}</button></form></section>
    <section className="account-panel"><h2><ShieldCheck size={21}/>{t('Hiển thị & dữ liệu cũ', 'Display & previous data')}</h2><p>{t('Tùy chỉnh kana, romaji và giọng đọc; nhập hoặc khôi phục dữ liệu từ tệp JSON.', 'Adjust kana, romaji and speech preferences; import or restore JSON data.')}</p><button className="btn secondary" onClick={() => setSettings(true)}>{t('Mở tùy chỉnh & sao lưu', 'Open display & backup')}<ArrowRight size={17}/></button><hr /><h3>{t('Dữ liệu đã lưu trước khi tạo tài khoản', 'Data saved before registration')}</h3><p>{t('Nhập các từ đã lưu ở chế độ khách trên thiết bị này. Dữ liệu nguồn được giữ nguyên; từ trùng trong cùng bộ thẻ sẽ được bỏ qua.', 'Import words saved in guest mode on this device. Source data stays intact; duplicate words in the same deck are skipped.')}</p><button className="btn secondary" disabled={!ready} onClick={() => importLegacy()}><Import size={17}/>{t('Nhập từ dữ liệu thiết bị', 'Import previous device words')}</button><p className="hint">{t('Email hiện dùng làm tên đăng nhập, chưa có xác minh hoặc khôi phục mật khẩu qua email.', 'Email is currently a sign-in identifier; verification and email password recovery are not enabled.')}</p></section></div>
    {settings && <StudySettings close={() => setSettings(false)}/>}
  </div>;
}
