import { env } from 'cloudflare:workers';
import { getAccount } from '@/lib/auth/server';
import { getChatGPTUser } from '../../chatgpt-auth';
export async function GET() { const user = await getAccount(); const platform = await getChatGPTUser(); const legacyKey = platform?.userId ?? 'guest'; const config = env as Cloudflare.Env & {GEMINI_API_KEY?:string; GEMINI_MODEL?:string}; return Response.json({ ai: !!config.GEMINI_API_KEY && !!config.GEMINI_MODEL, cloud: !!env.DB, user, localKey: user ? `account:${user.id}` : legacyKey, legacyKey }, { headers: { 'Cache-Control': 'no-store' } }); }
