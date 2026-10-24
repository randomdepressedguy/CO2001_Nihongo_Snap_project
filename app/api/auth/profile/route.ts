import { authAction } from '@/lib/auth/service';
export async function POST(request: Request) { return authAction(request, 'profile'); }
