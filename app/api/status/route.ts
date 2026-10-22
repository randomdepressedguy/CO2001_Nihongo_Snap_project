import { env } from 'cloudflare:workers';
import { getAccount } from '@/lib/auth/server';
import { getChatGPTUser } from '../../chatgpt-auth';
export async function GET() { const user = await getAccount(); const platform = await getChatGPTUser(); const legacyKey = platform?.userId ?? 'guest'; return Response.json({ ai: false, cloud: !!env.DB, user, localKey: user ? `account:${user.id}` : legacyKey, legacyKey }, { headers: { 'Cache-Control': 'no-store' } }); }
