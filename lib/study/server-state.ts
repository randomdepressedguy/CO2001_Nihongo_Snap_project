import { validateState } from './core.ts';
const headers = { 'Cache-Control': 'no-store' };
export async function readStudyState(database: D1Database | undefined, identity: string | null) {
    if (!identity)
        return Response.json({ error: 'Đăng nhập để tải dữ liệu tài khoản.' }, { status: 401, headers });
    if (!database)
        return Response.json({ error: 'Dịch vụ lưu trữ tạm thời không khả dụng.' }, { status: 503, headers });
    try {
        const row = await database.prepare('SELECT payload,revision FROM study_state WHERE user_id=?').bind(identity).first<{
            payload: string;
            revision: number;
        }>();
        return Response.json({ state: row ? JSON.parse(row.payload) : null, revision: row?.revision ?? 0 }, { headers });
    }
    catch {
        return Response.json({ error: 'Chưa đọc được dữ liệu. Vui lòng thử lại.' }, { status: 503, headers });
    }
}
export async function writeStudyState(request: Request, database: D1Database | undefined, identity: string | null) {
    if (!identity)
        return Response.json({ error: 'Đăng nhập để lưu dữ liệu tài khoản.' }, { status: 401, headers });
    if (!database)
        return Response.json({ error: 'Dịch vụ lưu trữ tạm thời không khả dụng.' }, { status: 503, headers });
    const origin = request.headers.get('origin');
    if (origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site')
        return Response.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403, headers });
    if (!request.headers.get('content-type')?.includes('application/json'))
        return Response.json({ error: 'Định dạng không hợp lệ.' }, { status: 415, headers });
    try {
        const reader = request.body?.getReader();
        if (!reader)
            throw Error();
        let raw = '', bytes = 0;
        const decoder = new TextDecoder();
        while (true) {
            const part = await reader.read();
            if (part.done)
                break;
            bytes += part.value.byteLength;
            if (bytes > 10 * 1024 * 1024) {
                await reader.cancel();
                return Response.json({ error: 'Dữ liệu vượt giới hạn 10 MB. Có thể xuất bản sao JSON.' }, { status: 413, headers });
            }
            raw += decoder.decode(part.value, { stream: true });
        }
        const body = JSON.parse(raw + decoder.decode());
        if (!Number.isSafeInteger(body.revision) || body.revision < 0)
            throw Error();
        const state = validateState(body.state), payload = JSON.stringify(state);
        let result;
        if (body.revision === 0)
            result = await database.prepare('INSERT OR IGNORE INTO study_state (user_id,payload,revision,updated_at) VALUES (?,?,1,?)').bind(identity, payload, new Date().toISOString()).run();
        else
            result = await database.prepare('UPDATE study_state SET payload=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?').bind(payload, new Date().toISOString(), identity, body.revision).run();
        if (!result.meta.changes)
            return Response.json({ error: 'Máy chủ có thay đổi từ phiên khác. Bản trên thiết bị được giữ nguyên.' }, { status: 409, headers });
        return Response.json({ revision: body.revision + 1 }, { headers });
    }
    catch {
        return Response.json({ error: 'Dữ liệu không hợp lệ hoặc lưu trữ bị gián đoạn. Bản hiện có chưa bị thay thế.' }, { status: 400, headers });
    }
}
