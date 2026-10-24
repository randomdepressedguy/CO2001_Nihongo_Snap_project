'use client';
import { useEffect, useState } from 'react';
import Link from './NavigationLink';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Bookmark, Check, CircleAlert, Home, Layers, LogIn, Menu, RotateCcw, Search, Settings2, UserRound, X } from 'lucide-react';
import { StudyProvider, useStudy, type StudyStatus } from './context';
import { WordDetail } from './shared';
import { Decks, Dictionary, Notebook, Review, downloadJSON } from './Vocabulary';
import { StudySettings } from './StudySettings';
import type { Word } from '@/lib/study/core';
const navigation = [
    ['/', 'Trang chủ', 'Home', Home], ['/cards', 'Thẻ từ vựng', 'Flashcards', Layers],
    ['/notebook', 'Sổ tay', 'Notebook', Bookmark], ['/review', 'Ôn tập', 'Review', RotateCcw],
    ['/dictionary', 'Từ điển', 'Dictionary', Search],
] as const;
export function AppFrame({ children, status }: {
    children: React.ReactNode;
    status: StudyStatus;
}) {
    return <StudyProvider initialStatus={status}><Frame>{children}</Frame></StudyProvider>;
}
function Frame({ children }: {
    children: React.ReactNode;
}) {
    const { s, set, t, status, storage, syncStatus, retrySave } = useStudy();
    const pathname = usePathname();
    const [menu, setMenu] = useState(false);
    const [settings, setSettings] = useState(false);
    const [online, setOnline] = useState(true);
    useEffect(() => { const connection = () => setOnline(navigator.onLine); connection(); window.addEventListener('online', connection); window.addEventListener('offline', connection); return () => { window.removeEventListener('online', connection); window.removeEventListener('offline', connection); }; }, []);
    useEffect(() => { setMenu(false); }, [pathname]);
    useEffect(() => { if (pathname === '/') {
        const old = location.hash.slice(1);
        const id = old.split('?')[0];
        if (['cards', 'notebook', 'review', 'dictionary'].includes(id))
            location.replace('/' + old);
    } }, []);
    const due = s.cards.filter(c => c.due <= Date.now()).length;
    return <div className="site-frame">
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" href="/" aria-label="Nihongo Snap — Trang chủ"><span className="brand-mark jp" lang="ja">日</span><span>Nihongo Snap<small>日本語を学ぶ · HỌC TIẾNG NHẬT</small></span></Link>
      <nav className="desktop-navigation" aria-label={t('Điều hướng chính', 'Main navigation')}>{navigation.map(([href, vi, en]) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined}>{t(vi, en)}</Link>)}</nav>
      <div className="header-actions"><button className="language-btn" aria-label={t('Đổi sang tiếng Anh', 'Switch to Vietnamese')} onClick={() => set(v => ({ ...v, settings: { ...v.settings, lang: v.settings.lang === 'vi' ? 'en' : 'vi' } }))}>{s.settings.lang.toUpperCase()}</button>{status.user ? <Link className={`account-link ${pathname === '/account' ? 'active' : ''}`} href="/account"><UserRound size={17}/><span>{t('Tài khoản', 'Account')}</span></Link> : <Link className="header-login" href="/login"><LogIn size={17}/><span>{t('Đăng nhập', 'Sign in')}</span></Link>}<button className="icon-btn menu-toggle" aria-label={menu ? t('Đóng điều hướng', 'Close navigation') : t('Mở điều hướng', 'Open navigation')} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={22}/> : <Menu size={22}/>}</button></div>
    </div>{menu && <nav className="mobile-menu" aria-label={t('Điều hướng mở rộng', 'Expanded navigation')}>{navigation.map(([href, vi, en, Icon]) => <Link key={href} href={href}><Icon size={18}/>{t(vi, en)}</Link>)}<Link href="/account"><UserRound size={18}/>{t('Tài khoản', 'Account')}</Link><button onClick={() => { setMenu(false); setSettings(true); }}><Settings2 size={18}/>{t('Hiển thị & sao lưu', 'Display & backup')}</button></nav>}</header>
    {!online && <div className="connection-note"><CircleAlert size={16}/>{t('Mất kết nối. Nội dung đã tải vẫn có thể sử dụng; thay đổi đang được giữ trên thiết bị.', 'Offline. Loaded content remains available; changes are kept on this device.')}</div>}
    {storage === 'error' && <div className="connection-note error" role="alert"><CircleAlert size={17}/>{t('Chưa lưu được trên thiết bị. Có thể xuất bản sao JSON trong phần sao lưu.', 'Device saving failed. Export a JSON backup in Settings.')}<button onClick={retrySave}>{t('Thử lại', 'Retry')}</button></div>}
    {syncStatus === 'conflict' && <div className="connection-note error" role="alert"><CircleAlert size={17}/>{t('Có thay đổi từ phiên khác. Bản trên thiết bị vẫn được giữ; kiểm tra tại trang Tài khoản.', 'Another session has newer changes. The device copy is preserved; check Account.')}<Link href="/account">{t('Xử lý', 'Resolve')}</Link></div>}
    {syncStatus === 'reauth' && <div className="connection-note error" role="alert"><CircleAlert size={17}/>{t('Phiên đăng nhập đã hết hạn. Thay đổi vẫn được giữ trên thiết bị.', 'The session has expired. Changes are kept on this device.')}<Link href="/login?next=%2Faccount">{t('Đăng nhập lại', 'Sign in again')}</Link></div>}
    <main id="main-content">{children}</main>
    <footer className="site-footer"><div className="footer-main"><div><Link className="brand" href="/"><span className="brand-mark jp" lang="ja">日</span><span>Nihongo Snap<small>日本語を学ぶ</small></span></Link><p>{t('Tra cứu từ vựng, ghi chú và ôn tập cách quãng.\nMột không gian học tiếng Nhật có hệ thống.', 'Vocabulary lookup, notes and spaced repetition.\nA focused space for Japanese study.')}</p></div><div><h2>{t('Học từ vựng', 'Vocabulary study')}</h2><Link href="/cards">{t('Thẻ từ vựng', 'Flashcards')}</Link><Link href="/notebook">{t('Sổ tay', 'Notebook')}</Link><Link href="/review">{t('Ôn tập', 'Review')}</Link><Link href="/dictionary">{t('Từ điển', 'Dictionary')}</Link></div><div><h2>{t('Tài khoản & dữ liệu', 'Account & data')}</h2><Link href="/account">{t('Quản lý tài khoản', 'Manage account')}</Link><button onClick={() => setSettings(true)}>{t('Hiển thị & sao lưu', 'Display & backup')}</button><span className="footer-storage"><span className={`status-dot ${storage}`}/>{storage === 'saving' ? t('Đang lưu trên thiết bị…', 'Saving on device…') : storage === 'saved' ? t('Dữ liệu thiết bị đã lưu', 'Device data saved') : t('Lỗi lưu trên thiết bị', 'Device saving error')}</span><small>{status.user ? (syncStatus === 'synced' ? t('Đã đồng bộ tài khoản', 'Account synchronized') : syncStatus === 'saving' ? t('Đang đồng bộ tài khoản…', 'Synchronizing account…') : t('Kiểm tra trạng thái tại Tài khoản', 'Check synchronization in Account')) : t('Chế độ khách · lưu trên thiết bị', 'Guest mode · device storage')}</small></div></div><div className="footer-bottom"><span>© 2026 Nihongo Snap</span><span className="jp" lang="ja">継続は力なり。</span><span>{t('Kiến thức được bồi đắp qua từng lần ôn.', 'Knowledge grows with every review.')}</span></div></footer>
    <nav className="bottom-nav" aria-label={t('Điều hướng điện thoại', 'Mobile navigation')}>{navigation.map(([href, vi, en, Icon]) => <Link key={href} href={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined}><Icon size={20}/><span>{t(vi, en)}</span>{href === '/review' && due > 0 && <i aria-hidden="true"/>}</Link>)}</nav>
    {settings && <StudySettings close={() => setSettings(false)}/>}
  </div>;
}
export function FeaturePage({ page }: {
    page: 'cards' | 'notebook' | 'review' | 'dictionary';
}) {
    const { ready, loadError, recovery, t, navigate } = useStudy();
    const search = useSearchParams();
    const [selected, setSelected] = useState<Word | null>(null);
    const go = (route: string) => { void navigate('/' + route); };
    return <div className={`feature-page feature-${page}`}>
    <div className="page-trail"><Link href="/">{t('Trang chủ', 'Home')}</Link><span>/</span><span>{t(...(navigation.find(n => n[0] === '/' + page)!.slice(1, 3) as [
        string,
        string
    ]))}</span><span className="page-trail-jp jp" lang="ja">{({ cards: '単語カード', notebook: '単語帳', review: '復習', dictionary: '辞書' })[page]}</span></div>
    {loadError ? <div className="empty" role="alert"><h1>{t('Không mở được dữ liệu đã lưu', 'Saved data is unavailable')}</h1><p>{t('Tự lưu đã tạm dừng để bảo vệ bản hiện có.', 'Autosave is paused to preserve existing data.')}</p><button className="btn" onClick={() => location.reload()}>{t('Tải lại', 'Reload')}</button>{recovery !== undefined && <button className="btn secondary" onClick={() => downloadJSON(recovery, 'nihongo-snap-recovery.json')}>{t('Xuất bản hiện có', 'Export existing data')}</button>}</div> : !ready ? <div className="loading-state" role="status"><span className="loading-mark jp">語</span><h1>{t('Đang tải dữ liệu học tập…', 'Loading study data…')}</h1></div> : <>
    {page === 'cards' && <Decks go={go} detail={setSelected}/>}
    {page === 'notebook' && <Notebook key={search.toString()} detail={setSelected}/>}
    {page === 'dictionary' && <Dictionary seed={search.get('q') || ''} detail={setSelected}/>}
    {page === 'review' && <Review key={search.toString()} go={go}/>}
    </>}{selected && <WordDetail word={selected} close={() => setSelected(null)}/>}
  </div>;
}
export default function App() { return <FeaturePage page="cards"/>; }
