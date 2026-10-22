import { env } from 'cloudflare:workers';
import { studyIdentity } from '@/lib/auth/server';
import { readStudyState, writeStudyState } from '@/lib/study/server-state';
export async function GET() { return readStudyState(env.DB, await studyIdentity()); }
export async function PUT(request: Request) { return writeStudyState(request, env.DB, await studyIdentity()); }
