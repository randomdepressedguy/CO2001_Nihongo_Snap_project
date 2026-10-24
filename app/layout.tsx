import type { Metadata } from 'next';
import { env } from 'cloudflare:workers';
import { getChatGPTUser } from './chatgpt-auth';
import { getAccount } from '@/lib/auth/server';
import { AppFrame } from '@/components/study/App';
import './globals.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: { default: 'Nihongo Snap — Học từ vựng tiếng Nhật', template: '%s · Nihongo Snap' }, description: 'Tra cứu từ vựng tiếng Nhật, ghi chú trong sổ tay và ôn tập cách quãng với thẻ từ vựng.', icons: { icon: '/favicon.svg' } };
export default async function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    let account = null;
    try {
        account = await getAccount();
    }
    catch { }
    const platform = await getChatGPTUser();
    const legacyKey = platform?.userId ?? 'guest';
    const status = { ai: false, cloud: !!env.DB, user: account, localKey: account ? `account:${account.id}` : legacyKey, legacyKey };
    return <html lang="vi"><body><a href="#main-content" className="skip-link">Bỏ qua điều hướng</a><AppFrame status={status}>{children}</AppFrame></body></html>;
}
