// Free, keyless Japanese Dictionary & JLPT Lookup Service
// 1. Checks internal curated dictionary (WORDS) first
// 2. Queries Jisho.org API (via /api/jisho proxy or allorigins CORS proxy fallback)
// 3. Enriches / falls back with KanjiAPI.dev (CORS-enabled, keyless)

import { WORDS } from './data.ts';
import { type Word, newId, normalize } from './core.ts';

export type DictionaryLookupResult = {
    word: string;
    reading: string;
    romaji: string;
    vi: string;
    en: string;
    jlpt: string;
    partsOfSpeech: string[];
    example?: string;
    exampleVi?: string;
    exampleEn?: string;
    kanjiDetails?: {
        kanji: string;
        meanings: string[];
        kunReadings: string[];
        onReadings: string[];
        jlpt: number | null;
        grade: number | null;
    }[];
    source: 'internal' | 'jisho' | 'kanjiapi' | 'fallback';
};

export const KANJI_API_BASE = 'https://kanjiapi.dev/v1';
export const JISHO_API_URL = 'https://jisho.org/api/v1/search/words';
export const ALLORIGINS_PROXY = 'https://api.allorigins.win/raw?url=';

const KANJI_REGEX = /[\u4E00-\u9FAF\u3400-\u4DBF]/;

export function containsKanji(text: string): boolean {
    return KANJI_REGEX.test(text);
}

export function extractKanjiCharacters(text: string): string[] {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const ch of text) {
        if (KANJI_REGEX.test(ch) && !seen.has(ch)) {
            seen.add(ch);
            list.push(ch);
        }
    }
    return list;
}

// Convert Katakana to Hiragana
export function katakanaToHiragana(input: string): string {
    return input.replace(/[\u30A1-\u30F6]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

// Lightweight Hepburn romaji converter for kana readings
const DIGRAPH_MAP: Record<string, string> = {
    きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
    しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
    ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
    にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
    ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
    みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
    りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
    ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
    じゃ: 'ja',  じゅ: 'ju',  じょ: 'jo',
    びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
    ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
};

const MONOGRAPH_MAP: Record<string, string> = {
    あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
    か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
    さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
    た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
    な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
    は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
    ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
    や: 'ya', ゆ: 'yu', よ: 'yo',
    ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
    わ: 'wa', を: 'o', ん: 'n',
    が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
    ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
    だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
    ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
    ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
    ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
    ゃ: 'ya', ゅ: 'yu', ょ: 'yo', ゎ: 'wa',
    ー: '-',
};

export function kanaToRomaji(kana: string): string {
    const hira = katakanaToHiragana(kana.trim());
    let result = '';
    let i = 0;
    while (i < hira.length) {
        const ch = hira[i];
        if (ch === 'っ' || ch === 'ッ') {
            const nextPair = hira.slice(i + 1, i + 3);
            const nextSingle = hira[i + 1] ?? '';
            const nextRomaji = DIGRAPH_MAP[nextPair] ?? MONOGRAPH_MAP[nextSingle] ?? '';
            if (nextRomaji && /^[a-z]/.test(nextRomaji)) {
                result += nextRomaji[0];
            }
            i += 1;
            continue;
        }
        const pair = hira.slice(i, i + 2);
        if (DIGRAPH_MAP[pair]) {
            result += DIGRAPH_MAP[pair];
            i += 2;
            continue;
        }
        if (MONOGRAPH_MAP[ch] !== undefined) {
            result += MONOGRAPH_MAP[ch];
        } else {
            result += ch;
        }
        i += 1;
    }
    return result;
}

export function formatJlptLevel(raw?: string | number | null): string {
    if (typeof raw === 'number' && raw >= 1 && raw <= 5) {
        return `N${raw}`;
    }
    if (typeof raw === 'string') {
        const match = raw.toUpperCase().match(/N[1-5]/);
        if (match) return match[0];
    }
    return '—';
}

export function lookupInternalWord(query: string): Word | null {
    const trimmed = query.trim();
    if (!trimmed) return null;
    const norm = normalize(trimmed);
    const exact = WORDS.find(w => w.jp === trimmed || normalize(w.jp) === norm);
    if (exact) return exact;
    const byReading = WORDS.find(w => normalize(w.kana) === norm);
    return byReading ?? null;
}

type JishoEntry = {
    slug?: string;
    jlpt?: string[];
    japanese?: { word?: string; reading?: string }[];
    senses?: {
        english_definitions?: string[];
        parts_of_speech?: string[];
    }[];
};

export function parseJishoResponse(raw: unknown, queryWord: string): DictionaryLookupResult | null {
    if (!raw || typeof raw !== 'object') return null;
    const data = (raw as { data?: unknown }).data;
    if (!Array.isArray(data) || data.length === 0) return null;

    // Prefer an entry matching the queried surface form if available
    const entries = data as JishoEntry[];
    const matched =
        entries.find(item =>
            item.japanese?.some(j => j.word === queryWord || j.reading === queryWord)
        ) ?? entries[0];

    const jpObj = matched.japanese?.[0] ?? {};
    const word = (jpObj.word || jpObj.reading || queryWord).trim();
    const reading = (jpObj.reading || word).trim();
    const senses = matched.senses ?? [];
    const definitions = senses
        .flatMap(s => s.english_definitions ?? [])
        .filter((d): d is string => typeof d === 'string' && d.trim().length > 0)
        .slice(0, 5);

    if (definitions.length === 0 && !jpObj.reading) return null;

    const partsOfSpeech = senses
        .flatMap(s => s.parts_of_speech ?? [])
        .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
        .slice(0, 3);

    const jlpt = formatJlptLevel(matched.jlpt?.[0]);
    const enMeaning = definitions.slice(0, 3).join('; ') || word;
    const internalMatch = lookupInternalWord(word) ?? lookupInternalWord(queryWord);

    return {
        word,
        reading,
        romaji: internalMatch?.romaji || kanaToRomaji(reading),
        vi: internalMatch?.vi || enMeaning,
        en: enMeaning,
        jlpt: jlpt !== '—' ? jlpt : internalMatch?.level ?? '—',
        partsOfSpeech,
        example: internalMatch?.example,
        exampleVi: internalMatch?.exampleVi,
        exampleEn: internalMatch?.exampleEn,
        source: 'jisho',
    };
}

export type KanjiApiCharResponse = {
    kanji: string;
    grade: number | null;
    stroke_count: number;
    meanings: string[];
    kun_readings: string[];
    on_readings: string[];
    name_readings: string[];
    jlpt: number | null;
    unicode: string;
};

export type KanjiApiWordEntry = {
    variants: {
        written: string;
        pronounced: string;
        priorities?: string[];
    }[];
    meanings: {
        glosses: string[];
    }[];
};

export async function fetchKanjiInfo(
    char: string,
    fetchImpl: typeof fetch = fetch,
    signal?: AbortSignal
): Promise<KanjiApiCharResponse | null> {
    const clean = char.trim()[0];
    if (!clean || !containsKanji(clean)) return null;
    const url = `${KANJI_API_BASE}/kanji/${encodeURIComponent(clean)}`;
    const response = await fetchImpl(url, { signal });
    if (!response.ok) return null;
    const data = (await response.json()) as KanjiApiCharResponse;
    if (!data || typeof data.kanji !== 'string') return null;
    return data;
}

export async function fetchKanjiWords(
    char: string,
    fetchImpl: typeof fetch = fetch,
    signal?: AbortSignal
): Promise<KanjiApiWordEntry[]> {
    const clean = char.trim()[0];
    if (!clean || !containsKanji(clean)) return [];
    const url = `${KANJI_API_BASE}/words/${encodeURIComponent(clean)}`;
    const response = await fetchImpl(url, { signal });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? (data as KanjiApiWordEntry[]) : [];
}

const lookupCache = new Map<string, DictionaryLookupResult>();

export function clearLookupCache() {
    lookupCache.clear();
}

export async function lookupJapaneseWord(
    rawWord: string,
    options?: {
        signal?: AbortSignal;
        fetchImpl?: typeof fetch;
        sourceSentence?: string;
    }
): Promise<DictionaryLookupResult> {
    const query = rawWord.trim();
    if (!query) {
        return {
            word: '',
            reading: '',
            romaji: '',
            vi: '',
            en: '',
            jlpt: '—',
            partsOfSpeech: [],
            source: 'fallback',
        };
    }

    const cached = lookupCache.get(query);
    if (cached) {
        return options?.sourceSentence && !cached.example
            ? { ...cached, example: options.sourceSentence }
            : cached;
    }

    // 1. Check internal dictionary first
    const internal = lookupInternalWord(query);
    if (internal) {
        const result: DictionaryLookupResult = {
            word: internal.jp,
            reading: internal.kana,
            romaji: internal.romaji || kanaToRomaji(internal.kana),
            vi: internal.vi,
            en: internal.en,
            jlpt: internal.level || 'N5',
            partsOfSpeech: [internal.tag],
            example: internal.example || options?.sourceSentence,
            exampleVi: internal.exampleVi,
            exampleEn: internal.exampleEn,
            source: 'internal',
        };
        lookupCache.set(query, result);
        return result;
    }

    const fetcher = options?.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);
    if (!fetcher) {
        return buildFallbackResult(query, options?.sourceSentence);
    }

    // 2. Try Jisho.org API (first via local Next API proxy /api/jisho, then via allorigins CORS proxy)
    const jishoTargetUrl = `${JISHO_API_URL}?keyword=${encodeURIComponent(query)}`;
    const candidateUrls = [
        typeof window !== 'undefined' ? `/api/jisho?keyword=${encodeURIComponent(query)}` : null,
        `${ALLORIGINS_PROXY}${encodeURIComponent(jishoTargetUrl)}`,
        jishoTargetUrl,
    ].filter((u): u is string => Boolean(u));

    for (const url of candidateUrls) {
        try {
            const response = await fetcher(url, { signal: options?.signal });
            if (!response.ok) continue;
            const json: unknown = await response.json();
            const parsed = parseJishoResponse(json, query);
            if (parsed) {
                // Optionally enrich JLPT level from KanjiAPI if Jisho didn't have one
                if (parsed.jlpt === '—' && containsKanji(query)) {
                    try {
                        const firstKanji = extractKanjiCharacters(query)[0];
                        if (firstKanji) {
                            const kInfo = await fetchKanjiInfo(firstKanji, fetcher, options?.signal);
                            if (kInfo?.jlpt) {
                                parsed.jlpt = formatJlptLevel(kInfo.jlpt);
                            }
                        }
                    } catch {
                        // Ignore enrichment error
                    }
                }
                if (options?.sourceSentence && !parsed.example) {
                    parsed.example = options.sourceSentence;
                }
                lookupCache.set(query, parsed);
                return parsed;
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
                throw err;
            }
        }
    }

    // 3. Fallback to KanjiAPI.dev (/v1/kanji/{char} and /v1/words/{char})
    const kanjiChars = extractKanjiCharacters(query);
    if (kanjiChars.length > 0) {
        try {
            const firstKanji = kanjiChars[0];
            const [kanjiInfo, kanjiWords] = await Promise.all([
                fetchKanjiInfo(firstKanji, fetcher, options?.signal).catch(() => null),
                fetchKanjiWords(firstKanji, fetcher, options?.signal).catch(() => [] as KanjiApiWordEntry[]),
            ]);

            // Look for exact compound word match in /v1/words/{char}
            for (const entry of kanjiWords) {
                const variant = entry.variants?.find(v => v.written === query);
                if (variant) {
                    const glosses = entry.meanings?.flatMap(m => m.glosses ?? []).filter(Boolean).slice(0, 3) ?? [];
                    const enMeaning = glosses.join('; ') || (kanjiInfo?.meanings?.slice(0, 3).join('; ') ?? query);
                    const reading = variant.pronounced || query;
                    const result: DictionaryLookupResult = {
                        word: query,
                        reading,
                        romaji: kanaToRomaji(reading),
                        vi: enMeaning,
                        en: enMeaning,
                        jlpt: formatJlptLevel(kanjiInfo?.jlpt),
                        partsOfSpeech: [],
                        example: options?.sourceSentence,
                        kanjiDetails: kanjiInfo
                            ? [
                                  {
                                      kanji: kanjiInfo.kanji,
                                      meanings: kanjiInfo.meanings ?? [],
                                      kunReadings: kanjiInfo.kun_readings ?? [],
                                      onReadings: kanjiInfo.on_readings ?? [],
                                      jlpt: kanjiInfo.jlpt ?? null,
                                      grade: kanjiInfo.grade ?? null,
                                  },
                              ]
                            : undefined,
                        source: 'kanjiapi',
                    };
                    lookupCache.set(query, result);
                    return result;
                }
            }

            if (kanjiInfo) {
                const readingRaw =
                    kanjiInfo.kun_readings?.[0]?.replace(/\..*$/, '') ||
                    katakanaToHiragana(kanjiInfo.on_readings?.[0] ?? '') ||
                    query;
                const enMeaning = (kanjiInfo.meanings ?? []).slice(0, 4).join('; ') || query;
                const result: DictionaryLookupResult = {
                    word: query,
                    reading: readingRaw,
                    romaji: kanaToRomaji(readingRaw),
                    vi: enMeaning,
                    en: enMeaning,
                    jlpt: formatJlptLevel(kanjiInfo.jlpt),
                    partsOfSpeech: ['kanji'],
                    example: options?.sourceSentence,
                    kanjiDetails: [
                        {
                            kanji: kanjiInfo.kanji,
                            meanings: kanjiInfo.meanings ?? [],
                            kunReadings: kanjiInfo.kun_readings ?? [],
                            onReadings: kanjiInfo.on_readings ?? [],
                            jlpt: kanjiInfo.jlpt ?? null,
                            grade: kanjiInfo.grade ?? null,
                        },
                    ],
                    source: 'kanjiapi',
                };
                lookupCache.set(query, result);
                return result;
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
                throw err;
            }
        }
    }

    const fallback = buildFallbackResult(query, options?.sourceSentence);
    lookupCache.set(query, fallback);
    return fallback;
}

function buildFallbackResult(query: string, sourceSentence?: string): DictionaryLookupResult {
    const reading = katakanaToHiragana(query);
    return {
        word: query,
        reading,
        romaji: kanaToRomaji(reading),
        vi: 'Từ trích xuất từ OCR (chưa có nghĩa trong từ điển ngoại tuyến)',
        en: 'OCR extracted vocabulary (edit meaning before studying)',
        jlpt: '—',
        partsOfSpeech: [],
        example: sourceSentence,
        source: 'fallback',
    };
}

export function lookupResultToWord(
    lookup: DictionaryLookupResult,
    sourceSentence?: string
): Word {
    const example = lookup.example || sourceSentence || '';
    return {
        id: newId(),
        jp: lookup.word.slice(0, 100),
        kana: (lookup.reading || lookup.word).slice(0, 100),
        romaji: (lookup.romaji || kanaToRomaji(lookup.reading || lookup.word)).slice(0, 100),
        vi: (lookup.vi || lookup.en || lookup.word).slice(0, 300),
        en: (lookup.en || lookup.vi || lookup.word).slice(0, 300),
        tag: 'snap-ocr',
        level: lookup.jlpt || '—',
        example: example.slice(0, 500),
        exampleVi: (lookup.exampleVi || '').slice(0, 500),
        exampleEn: (lookup.exampleEn || '').slice(0, 500),
    };
}
