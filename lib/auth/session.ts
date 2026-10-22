import { tokenHash } from './password.ts';
export type Account = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
};
export const SESSION_COOKIE = 'ns_session';
export function requestSessionToken(request: Request): string | null {
    const token = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
    return token && /^[a-f\d]{64}$/.test(token) ? token : null;
}
export async function sessionAccount(request: Request, database?: D1Database): Promise<Account | null> {
    const token = requestSessionToken(request);
    if (!database || !token)
        return null;
    return await database.prepare('SELECT a.id,a.email,a.name,a.created_at AS createdAt FROM app_sessions s JOIN app_accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?').bind(tokenHash(token), Date.now()).first<Account>() ?? null;
}
