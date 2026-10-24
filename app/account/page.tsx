import { requireAccount } from '@/lib/auth/server';
import { AccountPage } from '@/components/study/Account';
export const metadata = { title: 'Tài khoản' };
export const dynamic = 'force-dynamic';
export default async function Page() { const account = await requireAccount('/account'); return <AccountPage account={account}/>; }
