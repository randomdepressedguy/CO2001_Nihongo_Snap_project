// Japanese handwriting recognition service (Mazii-style draw-to-search)
// Uses Google Input Tools, with local stroke-count suggestions when unavailable.

export type HandwritingStroke = [number[], number[], number[]];

export type HandwritingRecognitionResult = {
    candidates: string[];
    source: 'google-ime' | 'fallback';
    error?: string;
};

export const GOOGLE_HANDWRITING_ENDPOINT =
    'https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=demopage';
export const HANDWRITING_TIMEOUT_MS = 5000;
export const MAX_HANDWRITING_CANDIDATES = 64;

function resultLimit(value: number) {
    return Number.isFinite(value) ? Math.max(1, Math.min(MAX_HANDWRITING_CANDIDATES, Math.round(value))) : 8;
}

export function sanitizeStrokes(strokes: HandwritingStroke[]): HandwritingStroke[] {
    if (!Array.isArray(strokes)) return [];
    const valid: HandwritingStroke[] = [];
    for (const stroke of strokes) {
        if (!Array.isArray(stroke) || stroke.length < 2) continue;
        const [xs, ys, ts] = stroke;
        if (!Array.isArray(xs) || !Array.isArray(ys)) continue;
        const len = Math.min(xs.length, ys.length);
        if (len === 0) continue;
        const cleanX: number[] = [];
        const cleanY: number[] = [];
        const cleanT: number[] = [];
        for (let i = 0; i < len; i++) {
            const x = Number(xs[i]);
            const y = Number(ys[i]);
            const t = Array.isArray(ts) && Number.isFinite(Number(ts[i])) ? Math.max(0, Math.round(Number(ts[i]))) : i * 16;
            if (Number.isFinite(x) && Number.isFinite(y)) {
                cleanX.push(Math.round(x));
                cleanY.push(Math.round(y));
                cleanT.push(t);
            }
        }
        if (cleanX.length > 0) {
            valid.push([cleanX, cleanY, cleanT]);
        }
    }
    return valid;
}

export function buildHandwritingPayload(
    strokes: HandwritingStroke[],
    width = 280,
    height = 240,
    maxResults = 8
) {
    const cleanStrokes = sanitizeStrokes(strokes);
    return {
        app_version: 0.4,
        api_level: '537.36',
        device: '5.0 (Windows NT 10.0; Win64; x64)',
        input_type: 0,
        options: 'enable_pre_space',
        requests: [
            {
                writing_guide: {
                    writing_area_width: Math.max(1, Math.round(width)),
                    writing_area_height: Math.max(1, Math.round(height)),
                },
                pre_context: '',
                max_num_results: Math.max(1, Math.min(20, Math.round(maxResults))),
                max_completions: 0,
                language: 'ja',
                ink: cleanStrokes,
            },
        ],
    };
}

export function parseHandwritingResponse(raw: unknown, maxResults = 8): string[] {
    const limit = resultLimit(maxResults);
    if (!Array.isArray(raw) || raw[0] !== 'SUCCESS' || !Array.isArray(raw[1])) {
        return [];
    }
    const firstEntry = raw[1][0];
    if (!Array.isArray(firstEntry) || !Array.isArray(firstEntry[1])) {
        return [];
    }
    const rawCandidates = firstEntry[1];
    const seen = new Set<string>();
    const results: string[] = [];
    for (const item of rawCandidates) {
        if (typeof item !== 'string') continue;
        const trimmed = item.trim();
        if (!trimmed || seen.has(trimmed)) continue;
        seen.add(trimmed);
        results.push(trimmed);
        if (results.length >= limit) break;
    }
    return results;
}

// These are suggestions, not a general-purpose offline handwriting recognizer.
const FALLBACK_BY_STROKES: Record<number, string[]> = {
    1: ['一', 'ノ', 'し', 'つ', 'く', 'へ', 'ん', '乙'],
    2: ['二', '人', '十', '七', '八', '入', '力', 'い', 'こ', 'り', 'う', '刀'],
    3: ['三', '山', '川', '大', '小', '上', '下', '口', '土', '女', '子', '千', '夕', 'あ', 'お', 'さ', 'き'],
    4: ['日', '月', '火', '水', '木', '中', '天', '犬', '手', '文', '元', '今', '友', '父', '牛', '午', '少'],
    5: ['本', '生', '先', '母', '兄', '白', '目', '田', '出', '右', '左', '外', '古', '広', '半', '北'],
    6: ['行', '気', '休', '安', '好', '年', '早', '百', '名', '会', '社', '同', '肉', '自', '色', '耳'],
    7: ['見', '車', '何', '私', '花', '来', '作', '体', '言', '足', '町', '売', '姉', '弟', '近', '声'],
    8: ['学', '金', '雨', '空', '国', '店', '明', '東', '長', '知', '服', '物', '事', '使', '始', '泳'],
    9: ['食', 'ت', '茶', '前', '後', '春', '秋', '思', '待', '持', '室', '昼', '海', '音', '風', '飛'].filter(c => c !== 'ت'),
    10: ['飲', '校', '時', '高', '家', '書', '記', '帰', '紙', '起', '病', '院', '旅', '勉', '夏', '週'],
    11: ['魚', '猫', '鳥', '雪', '教', '週', '強', '習', '問', '宿', '族', '野', '菜', '動', '堂', '産'],
    12: ['飲', '飯', '間', '朝', '晩', '買', '開', '閉', '道', '場', '答', '森', '暑', '寒', '着', '集'],
    13: ['話', '電', '新', '意', '楽', '働', '業', '漢', '詩', '試', '遠', '暗', '感', '想', '寝', '靴'],
    14: ['語', '読', '聞', '歌', '駅', '銀', '静', '緑', '練', '説', '髪', '鼻', '鳴', '様', '種', '歴'],
    15: ['課', '線', '質', '調', '論', '器', '歯', '熱', '確', '褒', '箱', '範', '標', '模', '潔', '澄'],
};

export function recognizeFallback(
    strokes: HandwritingStroke[],
    width = 280,
    height = 240,
    maxResults = 8
): string[] {
    const limit = resultLimit(maxResults);
    const clean = sanitizeStrokes(strokes);
    if (clean.length === 0) return [];
    const count = clean.length;
    const clampedCount = Math.max(1, Math.min(15, count));

    // Analyze first stroke direction for 1-2 stroke disambiguation
    const first = clean[0];
    const dx = (first[0][first[0].length - 1] ?? 0) - (first[0][0] ?? 0);
    const dy = (first[1][first[1].length - 1] ?? 0) - (first[1][0] ?? 0);
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let pool = [...(FALLBACK_BY_STROKES[clampedCount] ?? FALLBACK_BY_STROKES[4])];

    if (count === 1) {
        if (absDx > absDy * 1.8) {
            pool = ['一', 'へ', 'つ', 'こ', 'し', 'ノ', 'く', 'ん'];
        } else if (absDy > absDx * 1.5) {
            pool = ['し', 'ノ', 'く', 'ん', '一', 'つ', 'へ', '乙'];
        }
    } else if (count === 2) {
        if (absDx > absDy * 1.4) {
            pool = ['二', '十', '七', 'こ', '人', '八', '入', '力'];
        } else {
            pool = ['人', '八', 'い', 'り', '二', '十', '入', '七'];
        }
    }

    // Include adjacent stroke counts so slight stroke merging/splitting still surfaces target Kanji
    const neighborMinus = FALLBACK_BY_STROKES[Math.max(1, clampedCount - 1)] ?? [];
    const neighborPlus = FALLBACK_BY_STROKES[Math.min(15, clampedCount + 1)] ?? [];
    const combined = [...pool, ...neighborMinus.slice(0, 3), ...neighborPlus.slice(0, 3)];

    const seen = new Set<string>();
    const results: string[] = [];
    const _area = Math.max(1, width * height);
    void _area;
    for (const ch of combined) {
        if (!seen.has(ch)) {
            seen.add(ch);
            results.push(ch);
            if (results.length >= limit) break;
        }
    }
    return results;
}

export async function recognizeHandwriting(
    strokes: HandwritingStroke[],
    options?: {
        width?: number;
        height?: number;
        maxResults?: number;
        signal?: AbortSignal;
        fetchImpl?: typeof fetch;
        timeoutMs?: number;
    }
): Promise<HandwritingRecognitionResult> {
    const width = options?.width ?? 280;
    const height = options?.height ?? 240;
    const maxResults = resultLimit(options?.maxResults ?? 8);
    const cleanStrokes = sanitizeStrokes(strokes);
    const abortError = () => new DOMException('Handwriting recognition cancelled', 'AbortError');
    if (options?.signal?.aborted) throw abortError();

    if (cleanStrokes.length === 0) {
        return { candidates: [], source: 'google-ime' };
    }

    const fetcher = options?.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);
    if (!fetcher) {
        return {
            candidates: recognizeFallback(cleanStrokes, width, height, maxResults),
            source: 'fallback',
        };
    }

    const payload = buildHandwritingPayload(cleanStrokes, width, height, maxResults);
    const controller = new AbortController();
    const requestedTimeout = options?.timeoutMs ?? HANDWRITING_TIMEOUT_MS;
    const timeoutMs = Number.isFinite(requestedTimeout) && requestedTimeout > 0
        ? requestedTimeout : HANDWRITING_TIMEOUT_MS;
    let interrupt: (error: Error) => void = () => {};
    const interrupted = new Promise<never>((_, reject) => { interrupt = reject; });
    const cancel = () => {
        const error = abortError();
        controller.abort(error);
        interrupt(error);
    };
    options?.signal?.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(() => {
        const error = new DOMException('Handwriting recognition timed out', 'TimeoutError');
        controller.abort(error);
        interrupt(error);
    }, timeoutMs);

    try {
        // Race the whole response, including JSON, so even a stalled body ends.
        const candidates = await Promise.race([(async () => {
            const response = await fetcher(GOOGLE_HANDWRITING_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data: unknown = await response.json();
            return parseHandwritingResponse(data, maxResults);
        })(), interrupted]);
        if (options?.signal?.aborted) throw abortError();
        if (candidates.length > 0) {
            return { candidates, source: 'google-ime' };
        }
        return {
            candidates: recognizeFallback(cleanStrokes, width, height, maxResults),
            source: 'fallback',
        };
    } catch (error) {
        if (options?.signal?.aborted) throw abortError();
        return {
            candidates: recognizeFallback(cleanStrokes, width, height, maxResults),
            source: 'fallback',
            error: error instanceof Error ? error.message : 'Recognition request failed',
        };
    } finally {
        clearTimeout(timer);
        options?.signal?.removeEventListener('abort', cancel);
    }
}
