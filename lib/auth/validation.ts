export function validEmail(value: unknown): string | null {
    if (typeof value !== 'string')
        return null;
    const email = value.trim().toLowerCase();
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
export function validPassword(value: unknown): value is string { return typeof value === 'string' && value.length >= 12 && value.length <= 128; }
export function safeReturnPath(value: unknown): string {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
        return '/account';
    const target = new URL(value, 'https://local.invalid');
    return target.origin === 'https://local.invalid' && ['/cards', '/notebook', '/review', '/dictionary', '/account', '/'].includes(target.pathname) ? target.pathname + target.search : '/account';
}
