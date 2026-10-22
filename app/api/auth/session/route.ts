import { getAccount } from '@/lib/auth/server';
export const dynamic='force-dynamic';
export async function GET() { try { return Response.json({user:await getAccount()},{headers:{'Cache-Control':'no-store'}}); } catch { return Response.json({error:'Dịch vụ tài khoản tạm thời không khả dụng.'},{status:503}); } }
