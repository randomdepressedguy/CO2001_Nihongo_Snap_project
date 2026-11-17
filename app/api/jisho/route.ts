export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = (searchParams.get('keyword') ?? '').trim();
    if (!keyword || keyword.length > 80) {
        return Response.json({ data: [] }, { status: 400 });
    }

    const jishoUrl = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`;
    try {
        const response = await fetch(jishoUrl, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'NihongoSnap-OCR/1.0',
            },
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
            return Response.json({ data: [], error: `HTTP ${response.status}` }, { status: response.status });
        }
        const json: unknown = await response.json();
        return Response.json(json, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch {
        return Response.json({ data: [], error: 'Upstream unavailable' }, { status: 502 });
    }
}
