import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
let cryptoQueue = Promise.resolve();
function derive(password: string, salt: Buffer): Promise<Buffer> {
    // Serialize memory-hard work within an isolate to stay within Worker memory.
    const work = cryptoQueue.then(() => new Promise<Buffer>((resolve, reject) => {
        scrypt(password, salt, 32, options, (error, result) => error ? reject(error) : resolve(result));
    }));
    cryptoQueue = work.then(() => { }, () => { });
    return work;
}
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = await derive(password, salt);
    return `scrypt$32768$8$3$${salt.toString('hex')}$${hash.toString('hex')}`;
}
const dummy = `scrypt$32768$8$3$${'00'.repeat(16)}$${'00'.repeat(32)}`;
export async function verifyPassword(password: string, encoded: string | null): Promise<boolean> {
    const values = (encoded || dummy).split('$');
    if (values.length !== 6 || values.slice(0, 4).join('$') !== 'scrypt$32768$8$3' || !/^[a-f\d]{32}$/.test(values[4]) || !/^[a-f\d]{64}$/.test(values[5]))
        return false;
    const actual = await derive(password, Buffer.from(values[4], 'hex'));
    return timingSafeEqual(actual, Buffer.from(values[5], 'hex')) && encoded !== null;
}
export function newSessionToken() { return randomBytes(32).toString('hex'); }
export function tokenHash(value: string) { return createHash('sha256').update(value).digest('hex'); }
export { validEmail, validPassword, safeReturnPath } from './validation.ts';
