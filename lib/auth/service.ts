import { env } from 'cloudflare:workers';
import { sessionAccount, SESSION_COOKIE } from './session';
import { hashPassword, newSessionToken, tokenHash, validEmail, validPassword, verifyPassword } from './password';
type Action = 'register' | 'login' | 'logout' | 'profile' | 'password';
class AuthError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
function json(data: unknown, status = 200, cookie?: string) { return Response.json(data, { status, headers: { ...headers, ...(cookie ? { 'Set-Cookie': cookie } : {}) } }); }
function cookieFor(request: Request, value: string, seconds: number) {
    const secure = new URL(request.url).protocol === 'https:' || !import.meta.env.DEV;
    return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure ? '; Secure' : ''}`;
}
async function body(request: Request): Promise<Record<string, unknown>> {
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site')
        throw new AuthError(403, 'Yêu cầu không hợp lệ. Tải lại trang rồi thử lại.');
    if (!request.headers.get('content-type')?.includes('application/json'))
        throw new AuthError(415, 'Định dạng yêu cầu không hợp lệ.');
    const reader = request.body?.getReader();
    if (!reader)
        throw new AuthError(400, 'Thiếu thông tin.');
    let bytes = 0;
    let raw = '';
    const decoder = new TextDecoder();
    while (true) {
        const part = await reader.read();
        if (part.done)
            break;
        bytes += part.value.byteLength;
        if (bytes > 8192) {
            await reader.cancel();
            throw new AuthError(413, 'Thông tin vượt quá giới hạn.');
        }
        raw += decoder.decode(part.value, { stream: true });
    }
    try {
        const data = JSON.parse(raw + decoder.decode());
        if (!data || typeof data !== 'object' || Array.isArray(data))
            throw Error();
        return data;
    }
    catch {
        throw new AuthError(400, 'Thông tin không hợp lệ.');
    }
}
async function limit(request: Request, email: string, kind: string) {
    const db = env.DB!;
    const bucket = Math.floor(Date.now() / 900000);
    const ip = request.headers.get('cf-connecting-ip') || 'local';
    const keys = [`${kind}:ip:${tokenHash(ip)}:${bucket}`, `${kind}:email:${tokenHash(email)}:${bucket}`];
    const maxima = kind === 'register' ? [12, 4] : [40, 8];
    for (let i = 0; i < keys.length; i++) {
        const row = await db.prepare('INSERT INTO auth_throttles (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(keys[i], Date.now() + 1800000).first<{
            count: number;
        }>();
        if (!row || row.count > maxima[i])
            throw new AuthError(429, 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.');
    }
    await db.prepare('DELETE FROM auth_throttles WHERE expires_at<?').bind(Date.now()).run();
}
async function session(accountId: string, seconds: number, expectedHash: string) {
    const token = newSessionToken();
    const created = await env.DB!.prepare('INSERT INTO app_sessions (token_hash,account_id,expires_at,created_at) SELECT ?,id,?,? FROM app_accounts WHERE id=? AND password_hash=?').bind(tokenHash(token), Date.now() + seconds * 1000, Date.now(), accountId, expectedHash).run();
    if (!created.meta.changes)
        throw new AuthError(401, 'Thông tin đăng nhập đã thay đổi. Vui lòng đăng nhập lại.');
    await env.DB!.prepare('DELETE FROM app_sessions WHERE expires_at<?').bind(Date.now()).run();
    return token;
}
export async function authAction(request: Request, action: Action): Promise<Response> {
    try {
        if (!env.DB)
            throw new AuthError(503, 'Dịch vụ tài khoản tạm thời không khả dụng.');
        const input = await body(request);
        if (action === 'logout') {
            const raw = request.headers.get('cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
            if (raw && /^[a-f\d]{64}$/.test(raw))
                await env.DB.prepare('DELETE FROM app_sessions WHERE token_hash=?').bind(tokenHash(raw)).run();
            return json({ ok: true }, 200, cookieFor(request, '', 0));
        }
        if (action === 'register' || action === 'login') {
            const email = validEmail(input.email);
            if (!email || typeof input.password !== 'string' || input.password.length > 128)
                throw new AuthError(400, 'Email hoặc mật khẩu không hợp lệ.');
            await limit(request, email, action);
            if (action === 'register') {
                if (!validPassword(input.password))
                    throw new AuthError(400, 'Mật khẩu cần từ 12 đến 128 ký tự.');
                const name = typeof input.name === 'string' ? input.name.trim() : '';
                if (name.length < 2 || name.length > 40)
                    throw new AuthError(400, 'Tên hiển thị cần từ 2 đến 40 ký tự.');
                const id = crypto.randomUUID();
                const createdAt = new Date().toISOString();
                const hash = await hashPassword(input.password);
                const created = await env.DB.prepare('INSERT OR IGNORE INTO app_accounts (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)').bind(id, email, name, hash, createdAt).run();
                if (!created.meta.changes)
                    throw new AuthError(409, 'Không thể đăng ký email này. Hãy dùng email khác hoặc đăng nhập.');
                const token = await session(id, 7 * 86400, hash);
                return json({ user: { id, email, name, createdAt } }, 201, cookieFor(request, token, 7 * 86400));
            }
            const account = await env.DB.prepare('SELECT id,email,name,password_hash,created_at AS createdAt FROM app_accounts WHERE email=?').bind(email).first<{
                id: string;
                email: string;
                name: string;
                password_hash: string;
                createdAt: string;
            }>();
            const verified = await verifyPassword(input.password, account?.password_hash ?? null);
            if (!account || !verified)
                throw new AuthError(401, 'Email hoặc mật khẩu chưa đúng.');
            const seconds = input.remember === true ? 30 * 86400 : 86400;
            const token = await session(account.id, seconds, account.password_hash);
            const { password_hash: _, ...user } = account;
            return json({ user }, 200, cookieFor(request, token, seconds));
        }
        const account = await sessionAccount(request, env.DB);
        if (!account)
            throw new AuthError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        if (action === 'profile') {
            const name = typeof input.name === 'string' ? input.name.trim() : '';
            if (name.length < 2 || name.length > 40)
                throw new AuthError(400, 'Tên hiển thị cần từ 2 đến 40 ký tự.');
            await env.DB.prepare('UPDATE app_accounts SET name=? WHERE id=?').bind(name, account.id).run();
            return json({ user: { ...account, name } });
        }
        await limit(request, account.email, 'password');
        if (typeof input.currentPassword !== 'string' || input.currentPassword.length > 128 || !validPassword(input.newPassword))
            throw new AuthError(400, 'Mật khẩu mới cần từ 12 đến 128 ký tự.');
        const stored = await env.DB.prepare('SELECT password_hash FROM app_accounts WHERE id=?').bind(account.id).first<{
            password_hash: string;
        }>();
        if (!await verifyPassword(input.currentPassword, stored?.password_hash ?? null))
            throw new AuthError(401, 'Mật khẩu hiện tại chưa đúng.');
        const hash = await hashPassword(input.newPassword);
        // Conditional update handles simultaneous password changes safely.
        const updated = await env.DB.prepare('UPDATE app_accounts SET password_hash=? WHERE id=? AND password_hash=?').bind(hash, account.id, stored!.password_hash).run();
        if (!updated.meta.changes)
            throw new AuthError(409, 'Mật khẩu đã được cập nhật ở phiên khác. Vui lòng đăng nhập lại.');
        await env.DB.prepare('DELETE FROM app_sessions WHERE account_id=?').bind(account.id).run();
        const token = await session(account.id, 7 * 86400, hash);
        return json({ ok: true }, 200, cookieFor(request, token, 7 * 86400));
    }
    catch (error) {
        if (error instanceof AuthError)
            return json({ error: error.message }, error.status);
        return json({ error: 'Dịch vụ tài khoản tạm thời gián đoạn. Vui lòng thử lại.' }, 503);
    }
}
