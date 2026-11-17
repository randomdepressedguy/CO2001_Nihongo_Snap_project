// Japanese OCR & Word Segmentation Service
// Uses Tesseract.js v5 (jpn + jpn_vert from jsDelivr CDN) and native Intl.Segmenter('ja-JP')

import { createWorker, OEM, PSM } from 'tesseract.js';
import { containsKanji } from './jishoService.ts';

export type OcrOrientation = 'horizontal' | 'vertical';

export type BoundingBox = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
};

export type OcrBoxItem = {
    id: string;
    text: string;
    bbox: BoundingBox;
    confidence: number;
    hasKanji: boolean;
    lineText: string;
};

export type OcrProgressUpdate = {
    status: string;
    progress: number; // 0 to 100
};

export type OcrRecognitionResult = {
    text: string;
    lines: string[];
    words: OcrBoxItem[];
    symbols: OcrBoxItem[];
    vocabulary: string[];
    imageWidth: number;
    imageHeight: number;
    processedImageUrl: string;
    orientation: OcrOrientation;
};

export const TESSERACT_CDN_CONFIG = {
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.1/dist/worker.min.js',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.0',
    getLangPath: (lang: 'jpn' | 'jpn_vert') =>
        `https://cdn.jsdelivr.net/npm/@tesseract.js-data/${lang}/4.0.0_best_int`,
} as const;

export function getTesseractConfigForMode(orientation: OcrOrientation): {
    lang: 'jpn' | 'jpn_vert';
    psm: PSM;
    langPath: string;
} {
    if (orientation === 'vertical') {
        return {
            lang: 'jpn_vert',
            psm: PSM.SINGLE_BLOCK_VERT_TEXT, // Page Segmentation Mode 5
            langPath: TESSERACT_CDN_CONFIG.getLangPath('jpn_vert'),
        };
    }
    return {
        lang: 'jpn',
        psm: PSM.AUTO, // Page Segmentation Mode 3
        langPath: TESSERACT_CDN_CONFIG.getLangPath('jpn'),
    };
}

// Isolated particles & grammatical function tokens to skip as standalone flashcard words
export const ISOLATED_PARTICLES = new Set([
    'は', 'が', 'を', 'に', 'で', 'の', 'と', 'も', 'へ', 'や', 'か', 'ね', 'よ', 'な', 'わ', 'ぞ', 'ぜ',
    'て', 'た', 'だ', 'し', 'ば', 'ら', 'さ', 'み', 'き', 'つ', 'っ', 'ん', 'ー',
    'から', 'まで', 'より', 'ので', 'のに', 'けど', 'けれど', 'だけ', 'しか', 'ほど', 'くらい', 'ぐらい',
    'です', 'ます', 'でした', 'ました', 'ない', 'たい', 'よう', 'そう', 'これ', 'それ', 'あれ', 'この', 'その', 'あの',
]);

const JAPANESE_CHAR_REGEX = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF々〆ヵヶー]/;
const JAPANESE_COMPOUND_FALLBACK_REGEX =
    /[\u4E00-\u9FAF\u3400-\u4DBF々〆ヵヶ]+[\u3040-\u309F]*|[\u30A0-\u30FFー]{2,}|[\u3040-\u309F]{2,}/g;

export function isMeaningfulJapaneseToken(rawToken: string): boolean {
    const token = rawToken.trim();
    if (!token) return false;
    if (!JAPANESE_CHAR_REGEX.test(token)) return false;
    // Strip surrounding punctuation/whitespace
    const cleaned = cleanJapaneseToken(token);
    if (!cleaned) return false;
    if (ISOLATED_PARTICLES.has(cleaned)) return false;
    // Single hiragana/katakana character is almost always a particle, okurigana fragment, or noise
    if (cleaned.length === 1 && !containsKanji(cleaned)) return false;
    return true;
}

export function cleanJapaneseToken(rawToken: string): string {
    return rawToken
        .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF々〆ヵヶー]/g, '')
        .trim();
}

/**
 * Segments Japanese text into meaningful vocabulary words using native Intl.Segmenter('ja-JP')
 * with a regex fallback for Kanji/Kana compounds.
 */
export function segmentJapaneseText(text: string): string[] {
    if (!text || typeof text !== 'string') return [];

    const rawTokens: string[] = [];

    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'word' });
        for (const part of segmenter.segment(text)) {
            if (part.isWordLike) {
                rawTokens.push(part.segment);
            }
        }
    } else {
        const matches = text.match(JAPANESE_COMPOUND_FALLBACK_REGEX) ?? [];
        rawTokens.push(...matches);
    }

    const seen = new Set<string>();
    const results: string[] = [];

    for (const raw of rawTokens) {
        const cleaned = cleanJapaneseToken(raw);
        if (!isMeaningfulJapaneseToken(cleaned)) continue;
        if (!seen.has(cleaned)) {
            seen.add(cleaned);
            results.push(cleaned);
        }
    }

    // Fallback if Segmenter merged or missed compounds
    if (results.length === 0) {
        const fallbackMatches = text.match(JAPANESE_COMPOUND_FALLBACK_REGEX) ?? [];
        for (const raw of fallbackMatches) {
            const cleaned = cleanJapaneseToken(raw);
            if (isMeaningfulJapaneseToken(cleaned) && !seen.has(cleaned)) {
                seen.add(cleaned);
                results.push(cleaned);
            }
        }
    }

    return results;
}

/**
 * Pure RGBA pixel transformation: grayscale conversion + contrast boost.
 * Doubles Tesseract recognition clarity on Japanese typography.
 */
export function applyGrayscaleAndContrast(
    pixels: Uint8ClampedArray,
    contrast = 38
): Uint8ClampedArray {
    const clampedContrast = Math.max(-100, Math.min(100, contrast));
    const factor = (259 * (clampedContrast + 255)) / (255 * (259 - clampedContrast));

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const boosted = Math.max(0, Math.min(255, Math.round(factor * (luma - 128) + 128)));
        pixels[i] = boosted;
        pixels[i + 1] = boosted;
        pixels[i + 2] = boosted;
    }
    return pixels;
}

export function computeScaledDimensions(
    width: number,
    height: number,
    maxDimension = 1600
): { width: number; height: number; scale: number } {
    const safeWidth = Math.max(1, Math.round(width));
    const safeHeight = Math.max(1, Math.round(height));
    const maxSide = Math.max(safeWidth, safeHeight);
    if (maxSide <= maxDimension) {
        return { width: safeWidth, height: safeHeight, scale: 1 };
    }
    const scale = maxDimension / maxSide;
    return {
        width: Math.max(1, Math.round(safeWidth * scale)),
        height: Math.max(1, Math.round(safeHeight * scale)),
        scale,
    };
}

/**
 * Preprocesses an image on an offscreen <canvas>:
 * - Resizes max dimension to 1600px
 * - Converts to grayscale and applies contrast boost
 */
export async function preprocessImageForOcr(
    source: string,
    maxDimension = 1600,
    contrast = 38
): Promise<{ dataUrl: string; width: number; height: number; originalWidth: number; originalHeight: number }> {
    if (typeof document === 'undefined' || typeof Image === 'undefined') {
        throw new Error('Image preprocessing requires a browser canvas environment.');
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const origW = img.naturalWidth || img.width || 1;
                const origH = img.naturalHeight || img.height || 1;
                const { width, height } = computeScaledDimensions(origW, origH, maxDimension);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas 2D context is unavailable.'));
                    return;
                }

                // Fill white background for transparent PNGs
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height);
                applyGrayscaleAndContrast(imageData.data, contrast);
                ctx.putImageData(imageData, 0, 0);

                resolve({
                    dataUrl: canvas.toDataURL('image/png'),
                    width,
                    height,
                    originalWidth: origW,
                    originalHeight: origH,
                });
            } catch (err) {
                reject(err instanceof Error ? err : new Error('Failed to preprocess image'));
            }
        };
        img.onerror = () => reject(new Error('Could not decode image. Please use JPG, PNG, or WebP.'));
        img.src = source;
    });
}

type RawSymbol = {
    text?: string;
    confidence?: number;
    bbox?: BoundingBox;
};

type RawWord = {
    text?: string;
    confidence?: number;
    bbox?: BoundingBox;
    symbols?: RawSymbol[];
};

type RawLine = {
    text?: string;
    confidence?: number;
    bbox?: BoundingBox;
    words?: RawWord[];
    symbols?: RawSymbol[];
};

export type RawTesseractPage = {
    text?: string;
    confidence?: number;
    lines?: RawLine[];
    words?: RawWord[];
    symbols?: RawSymbol[];
};

function isValidBbox(bbox?: BoundingBox | null): bbox is BoundingBox {
    if (!bbox) return false;
    return (
        Number.isFinite(bbox.x0) &&
        Number.isFinite(bbox.y0) &&
        Number.isFinite(bbox.x1) &&
        Number.isFinite(bbox.y1) &&
        bbox.x1 > bbox.x0 &&
        bbox.y1 > bbox.y0
    );
}

function mergeBboxes(boxes: BoundingBox[]): BoundingBox {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const b of boxes) {
        if (b.x0 < x0) x0 = b.x0;
        if (b.y0 < y0) y0 = b.y0;
        if (b.x1 > x1) x1 = b.x1;
        if (b.y1 > y1) y1 = b.y1;
    }
    return { x0, y0, x1, y1 };
}

/**
 * Extracts structured lines, segmented Japanese word bounding boxes, symbol bounding boxes,
 * and deduplicated vocabulary from a Tesseract.js Page result.
 */
export function extractOcrElements(
    page: RawTesseractPage,
    orientation: OcrOrientation = 'horizontal'
): {
    text: string;
    lines: string[];
    words: OcrBoxItem[];
    symbols: OcrBoxItem[];
    vocabulary: string[];
} {
    const rawLines = Array.isArray(page.lines) ? page.lines : [];
    const rawWords = Array.isArray(page.words) ? page.words : [];
    const rawSymbols = Array.isArray(page.symbols) ? page.symbols : [];

    const cleanLines: string[] = [];
    for (const line of rawLines) {
        const lineStr = (line.text ?? '').replace(/\s+/g, '').trim();
        if (lineStr && JAPANESE_CHAR_REGEX.test(lineStr)) {
            cleanLines.push(lineStr);
        }
    }

    const fallbackFullText = (page.text ?? '')
        .split(/\r?\n/)
        .map(l => l.replace(/\s+/g, '').trim())
        .filter(l => l.length > 0);

    const lines = cleanLines.length > 0 ? cleanLines : fallbackFullText;
    const text = lines.join('\n');

    // Collect symbol-level boxes
    const symbols: OcrBoxItem[] = [];
    let symIdx = 0;
    const allRawSymbols: { sym: RawSymbol; lineText: string }[] = [];

    if (rawLines.length > 0) {
        for (const line of rawLines) {
            const lText = (line.text ?? '').replace(/\s+/g, '').trim();
            const lineSyms =
                Array.isArray(line.symbols) && line.symbols.length > 0
                    ? line.symbols
                    : (line.words ?? []).flatMap(w => w.symbols ?? []);
            for (const sym of lineSyms) {
                allRawSymbols.push({ sym, lineText: lText });
            }
        }
    } else {
        for (const sym of rawSymbols) {
            allRawSymbols.push({ sym, lineText: text });
        }
    }

    for (const { sym, lineText } of allRawSymbols) {
        const ch = (sym.text ?? '').trim();
        if (!ch || !isValidBbox(sym.bbox)) continue;
        if (!JAPANESE_CHAR_REGEX.test(ch)) continue;
        symbols.push({
            id: `sym-${symIdx++}`,
            text: ch,
            bbox: sym.bbox,
            confidence: Number.isFinite(sym.confidence) ? Math.round(Number(sym.confidence)) : 80,
            hasKanji: containsKanji(ch),
            lineText: lineText || ch,
        });
    }

    // Build word-level bounding boxes aligned with Intl.Segmenter vocabulary tokens
    const words: OcrBoxItem[] = [];
    let wordIdx = 0;

    if (rawLines.length > 0) {
        for (const line of rawLines) {
            const lineSymbols = (
                Array.isArray(line.symbols) && line.symbols.length > 0
                    ? line.symbols
                    : (line.words ?? []).flatMap(w => w.symbols ?? [])
            ).filter(s => (s.text ?? '').trim().length > 0 && isValidBbox(s.bbox));

            const lineRawText =
                lineSymbols.length > 0
                    ? lineSymbols.map(s => (s.text ?? '').trim()).join('')
                    : (line.text ?? '').replace(/\s+/g, '').trim();

            if (!lineRawText || !JAPANESE_CHAR_REGEX.test(lineRawText)) continue;

            if (lineSymbols.length > 0 && typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
                // Map character offsets to symbol indices
                const charToSymIndex: number[] = [];
                lineSymbols.forEach((s, idx) => {
                    const t = (s.text ?? '').trim();
                    for (let c = 0; c < t.length; c++) {
                        charToSymIndex.push(idx);
                    }
                });

                const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'word' });
                for (const seg of segmenter.segment(lineRawText)) {
                    const cleaned = cleanJapaneseToken(seg.segment);
                    if (!seg.isWordLike || !isMeaningfulJapaneseToken(cleaned)) continue;
                    const startChar = seg.index;
                    const endChar = seg.index + seg.segment.length - 1;
                    const startSym = charToSymIndex[startChar];
                    const endSym = charToSymIndex[Math.min(endChar, charToSymIndex.length - 1)];
                    if (startSym !== undefined && endSym !== undefined && endSym >= startSym) {
                        const matchedSyms = lineSymbols.slice(startSym, endSym + 1);
                        const boxes = matchedSyms.map(m => m.bbox!).filter(isValidBbox);
                        if (boxes.length > 0) {
                            const avgConf =
                                matchedSyms.reduce((acc, m) => acc + (Number(m.confidence) || 80), 0) /
                                matchedSyms.length;
                            words.push({
                                id: `word-${wordIdx++}`,
                                text: cleaned,
                                bbox: mergeBboxes(boxes),
                                confidence: Math.round(avgConf),
                                hasKanji: containsKanji(cleaned),
                                lineText: lineRawText,
                            });
                        }
                    }
                }
            } else if (isValidBbox(line.bbox)) {
                // Interpolate segmented words along the line's bounding box
                const segWords = segmentJapaneseText(lineRawText);
                const totalLen = Math.max(1, lineRawText.length);
                const lb = line.bbox;
                let searchFrom = 0;
                for (const token of segWords) {
                    const pos = Math.max(0, lineRawText.indexOf(token, searchFrom));
                    searchFrom = pos + token.length;
                    const startFrac = Math.min(0.95, pos / totalLen);
                    const endFrac = Math.min(1, (pos + token.length) / totalLen);
                    const subBox: BoundingBox =
                        orientation === 'vertical'
                            ? {
                                  x0: lb.x0,
                                  y0: Math.round(lb.y0 + (lb.y1 - lb.y0) * startFrac),
                                  x1: lb.x1,
                                  y1: Math.max(
                                      Math.round(lb.y0 + (lb.y1 - lb.y0) * startFrac) + 4,
                                      Math.round(lb.y0 + (lb.y1 - lb.y0) * endFrac)
                                  ),
                              }
                            : {
                                  x0: Math.round(lb.x0 + (lb.x1 - lb.x0) * startFrac),
                                  y0: lb.y0,
                                  x1: Math.max(
                                      Math.round(lb.x0 + (lb.x1 - lb.x0) * startFrac) + 4,
                                      Math.round(lb.x0 + (lb.x1 - lb.x0) * endFrac)
                                  ),
                                  y1: lb.y1,
                              };
                    words.push({
                        id: `word-${wordIdx++}`,
                        text: token,
                        bbox: subBox,
                        confidence: Number.isFinite(line.confidence) ? Math.round(Number(line.confidence)) : 82,
                        hasKanji: containsKanji(token),
                        lineText: lineRawText,
                    });
                }
            }
        }
    }

    // Fallback if words array is still empty: use rawWords from Tesseract
    if (words.length === 0 && rawWords.length > 0) {
        for (const rw of rawWords) {
            const rawText = (rw.text ?? '').replace(/\s+/g, '').trim();
            if (!rawText || !isValidBbox(rw.bbox)) continue;
            const segs = segmentJapaneseText(rawText);
            if (segs.length > 0) {
                for (const token of segs) {
                    words.push({
                        id: `word-${wordIdx++}`,
                        text: token,
                        bbox: rw.bbox,
                        confidence: Number.isFinite(rw.confidence) ? Math.round(Number(rw.confidence)) : 80,
                        hasKanji: containsKanji(token),
                        lineText: rawText,
                    });
                }
            } else {
                const cleaned = cleanJapaneseToken(rawText);
                if (cleaned && JAPANESE_CHAR_REGEX.test(cleaned)) {
                    words.push({
                        id: `word-${wordIdx++}`,
                        text: cleaned,
                        bbox: rw.bbox,
                        confidence: Number.isFinite(rw.confidence) ? Math.round(Number(rw.confidence)) : 75,
                        hasKanji: containsKanji(cleaned),
                        lineText: rawText,
                    });
                }
            }
        }
    }

    // Build deduplicated vocabulary list (preserving order of appearance)
    const vocabSeen = new Set<string>();
    const vocabulary: string[] = [];
    for (const w of words) {
        if (isMeaningfulJapaneseToken(w.text) && !vocabSeen.has(w.text)) {
            vocabSeen.add(w.text);
            vocabulary.push(w.text);
        }
    }
    for (const token of segmentJapaneseText(text)) {
        if (!vocabSeen.has(token)) {
            vocabSeen.add(token);
            vocabulary.push(token);
        }
    }

    return {
        text,
        lines,
        words,
        symbols,
        vocabulary,
    };
}

/**
 * Converts a pixel bounding box to responsive percentage coordinates (0% - 100%)
 * so overlays remain accurately aligned across any screen size.
 */
export function bboxToPercentageStyle(
    bbox: BoundingBox,
    imageWidth: number,
    imageHeight: number
): { left: string; top: string; width: string; height: string } {
    const safeW = Math.max(1, imageWidth);
    const safeH = Math.max(1, imageHeight);
    const left = Math.max(0, Math.min(100, (bbox.x0 / safeW) * 100));
    const top = Math.max(0, Math.min(100, (bbox.y0 / safeH) * 100));
    const width = Math.max(0.5, Math.min(100 - left, ((bbox.x1 - bbox.x0) / safeW) * 100));
    const height = Math.max(0.5, Math.min(100 - top, ((bbox.y1 - bbox.y0) / safeH) * 100));
    return {
        left: `${left.toFixed(2)}%`,
        top: `${top.toFixed(2)}%`,
        width: `${width.toFixed(2)}%`,
        height: `${height.toFixed(2)}%`,
    };
}

/**
 * Runs Tesseract.js v5 Japanese OCR (Horizontal 'jpn' + PSM.AUTO or Vertical 'jpn_vert' + PSM.SINGLE_BLOCK_VERT_TEXT)
 * with offscreen canvas preprocessing and real-time progress reporting.
 */
export async function recognizeJapaneseImage(
    imageSource: string,
    options?: {
        orientation?: OcrOrientation;
        onProgress?: (update: OcrProgressUpdate) => void;
    }
): Promise<OcrRecognitionResult> {
    const orientation = options?.orientation ?? 'horizontal';
    const onProgress = options?.onProgress;

    onProgress?.({ status: 'Preprocessing image (grayscale & contrast)…', progress: 5 });
    const preprocessed = await preprocessImageForOcr(imageSource, 1600, 38);

    const { lang, psm, langPath } = getTesseractConfigForMode(orientation);
    onProgress?.({
        status:
            orientation === 'vertical'
                ? 'Loading vertical Japanese model (jpn_vert)…'
                : 'Loading horizontal Japanese model (jpn)…',
        progress: 12,
    });

    const worker = await createWorker(lang, OEM.LSTM_ONLY, {
        workerPath: TESSERACT_CDN_CONFIG.workerPath,
        corePath: TESSERACT_CDN_CONFIG.corePath,
        langPath,
        logger: msg => {
            if (!onProgress) return;
            const rawProg = typeof msg.progress === 'number' ? msg.progress : 0;
            let mapped = 15;
            if (msg.status?.includes('loading language')) {
                mapped = 15 + Math.round(rawProg * 30);
            } else if (msg.status?.includes('initializing')) {
                mapped = 45 + Math.round(rawProg * 10);
            } else if (msg.status?.includes('recognizing')) {
                mapped = 55 + Math.round(rawProg * 43);
            } else {
                mapped = Math.max(15, Math.min(95, Math.round(rawProg * 90)));
            }
            onProgress({
                status: msg.status || 'Recognizing Japanese text…',
                progress: Math.max(5, Math.min(99, mapped)),
            });
        },
    });

    try {
        await worker.setParameters({
            tessedit_pageseg_mode: psm,
            preserve_interword_spaces: '1',
        });

        const { data } = await worker.recognize(preprocessed.dataUrl);
        const extracted = extractOcrElements(data as unknown as RawTesseractPage, orientation);

        onProgress?.({ status: 'Complete', progress: 100 });

        return {
            text: extracted.text,
            lines: extracted.lines,
            words: extracted.words,
            symbols: extracted.symbols,
            vocabulary: extracted.vocabulary,
            imageWidth: preprocessed.width,
            imageHeight: preprocessed.height,
            processedImageUrl: preprocessed.dataUrl,
            orientation,
        };
    } finally {
        await worker.terminate();
    }
}

/**
 * Generates a high-contrast sample Japanese image (Horizontal or Vertical Manga/Book layout)
 * on a browser canvas so users can immediately test OCR, Bounding Boxes, and Snap-to-Deck.
 */
export function createSampleJapaneseOcrImage(orientation: OcrOrientation = 'horizontal'): string {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');

    if (orientation === 'vertical') {
        canvas.width = 720;
        canvas.height = 900;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#fffdf9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decorative book border
        ctx.strokeStyle = '#2d3a2e';
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

        ctx.fillStyle = '#111111';
        ctx.font = 'bold 46px "Noto Serif JP", "Yu Mincho", "MS Mincho", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Columns read right-to-left (縦書き)
        const columns = [
            ['今', '日', 'は', '図書館', 'で'],
            ['日本語', 'の', '本', 'を', '読む'],
            ['友達', 'と', 'お茶', 'を', '飲む'],
        ];
        const colX = [540, 360, 180];
        columns.forEach((col, cIdx) => {
            const x = colX[cIdx];
            let y = 100;
            const chars = col.join('');
            for (const ch of chars) {
                ctx.fillText(ch, x, y);
                y += 68;
            }
        });
        return canvas.toDataURL('image/png');
    }

    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#3c4f39';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 48px "Noto Sans JP", "Yu Gothic", "Meiryo", sans-serif';
    ctx.textBaseline = 'top';

    const lines = [
        '今日は学校で日本語を勉強します。',
        '友達と図書館で新しい本を読む。',
        '駅でお茶とパンを買う。',
    ];
    lines.forEach((line, idx) => {
        ctx.fillText(line, 68, 95 + idx * 130);
    });

    return canvas.toDataURL('image/png');
}
