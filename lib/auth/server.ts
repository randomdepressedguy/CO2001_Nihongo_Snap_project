import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionAccount } from './session';
export type { Account } from './session';
export async function getAccount() {
    const requestHeaders = await headers();
    return sessionAccount(new Request('https://internal.invalid', { headers: { cookie: requestHeaders.get('cookie') ?? '' } }), env.DB);
}
export async function requireAccount(returnTo = '/account') {
    const account = await getAccount();
    if (!account)
        redirect(`/login?next=${encodeURIComponent(returnTo)}`);
    return account;
}
export async function studyIdentity(): Promise<string | null> {
    const account = await getAccount();
    if (account)
        return `account:${account.id}`;
    // An expired app session must never write into the platform guest collection.
    return null;
}
