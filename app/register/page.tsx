import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/auth/server';
import { AuthPage } from '@/components/study/Auth';
export const metadata = { title: 'Đăng ký' };
export const dynamic = 'force-dynamic';
export default async function Page() { if (await getAccount())
    redirect('/account'); return <AuthPage mode="register"/>; }
