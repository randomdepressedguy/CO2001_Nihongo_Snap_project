import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getTesseractConfigForMode,
    segmentJapaneseText,
    applyGrayscaleAndContrast,
    computeScaledDimensions,
    extractOcrElements,
    bboxToPercentageStyle,
} from '../lib/study/ocrService.ts';
import {
    containsKanji,
    kanaToRomaji,
    parseJishoResponse,
    lookupJapaneseWord,
    lookupResultToWord,
    clearLookupCache,
} from '../lib/study/jishoService.ts';

test('getTesseractConfigForMode returns jpn + PSM.AUTO (3) for horizontal and jpn_vert + PSM.SINGLE_BLOCK_VERT_TEXT (5) for vertical', () => {
    const horiz = getTesseractConfigForMode('horizontal');
    assert.equal(horiz.lang, 'jpn');
    assert.equal(horiz.psm, '3');
    assert.ok(horiz.langPath.includes('cdn.jsdelivr.net/npm/@tesseract.js-data/jpn'));

    const vert = getTesseractConfigForMode('vertical');
    assert.equal(vert.lang, 'jpn_vert');
    assert.equal(vert.psm, '5');
    assert.ok(vert.langPath.includes('cdn.jsdelivr.net/npm/@tesseract.js-data/jpn_vert'));
});

test('computeScaledDimensions caps max dimension at 1600px while preserving aspect ratio', () => {
    const small = computeScaledDimensions(800, 600, 1600);
    assert.equal(small.width, 800);
    assert.equal(small.height, 600);
    assert.equal(small.scale, 1);

    const large = computeScaledDimensions(3200, 2400, 1600);
    assert.equal(large.width, 1600);
    assert.equal(large.height, 1200);
    assert.equal(large.scale, 0.5);
});

test('applyGrayscaleAndContrast converts RGBA pixels to high-contrast grayscale', () => {
    const raw = new Uint8ClampedArray([
        240, 220, 200, 255, // bright pixel
        20, 30, 40, 255,    // dark pixel
    ]);
    const out = applyGrayscaleAndContrast(raw, 40);
    // R, G, B channels are equalized (grayscale)
    assert.equal(out[0], out[1]);
    assert.equal(out[1], out[2]);
    assert.equal(out[4], out[5]);
    assert.equal(out[5], out[6]);
    // Contrast stretches bright higher and dark lower
    assert.ok(out[0] > 220);
    assert.ok(out[4] < 25);
});

test('segmentJapaneseText splits Japanese sentences into vocabulary words and filters isolated particles', () => {
    const sentence = '今日は学校で日本語を勉強します。友達とお茶を飲む！';
    const tokens = segmentJapaneseText(sentence);
    assert.ok(tokens.includes('今日'));
    assert.ok(tokens.includes('学校'));
    assert.ok(tokens.includes('日本語'));
    assert.ok(tokens.includes('友達'));
    // Isolated particles must be filtered out
    for (const particle of ['は', 'で', 'を', 'と', 'の', 'が', 'に']) {
        assert.ok(!tokens.includes(particle), `Particle ${particle} should be excluded`);
    }
});

test('extractOcrElements and bboxToPercentageStyle build word/symbol bounding boxes with percentage coordinates', () => {
    const mockPage = {
        text: '日本語を学ぶ',
        lines: [
            {
                text: '日本語を学ぶ',
                confidence: 92,
                bbox: { x0: 100, y0: 50, x1: 600, y1: 130 },
                symbols: [
                    { text: '日', confidence: 95, bbox: { x0: 100, y0: 50, x1: 180, y1: 130 } },
                    { text: '本', confidence: 94, bbox: { x0: 180, y0: 50, x1: 260, y1: 130 } },
                    { text: '語', confidence: 93, bbox: { x0: 260, y0: 50, x1: 340, y1: 130 } },
                    { text: 'を', confidence: 90, bbox: { x0: 340, y0: 50, x1: 420, y1: 130 } },
                    { text: '学', confidence: 91, bbox: { x0: 420, y0: 50, x1: 510, y1: 130 } },
                    { text: 'ぶ', confidence: 89, bbox: { x0: 510, y0: 50, x1: 600, y1: 130 } },
                ],
            },
        ],
    };

    const extracted = extractOcrElements(mockPage, 'horizontal');
    assert.equal(extracted.text, '日本語を学ぶ');
    assert.equal(extracted.symbols.length, 6);
    assert.ok(extracted.words.some(w => w.text === '日本語'));
    assert.ok(extracted.vocabulary.includes('日本語'));

    const nihongoBox = extracted.words.find(w => w.text === '日本語');
    assert.ok(nihongoBox);
    assert.deepEqual(nihongoBox.bbox, { x0: 100, y0: 50, x1: 340, y1: 130 });
    assert.equal(nihongoBox.hasKanji, true);

    const pct = bboxToPercentageStyle(nihongoBox.bbox, 1000, 500);
    assert.equal(pct.left, '10.00%');
    assert.equal(pct.top, '10.00%');
    assert.equal(pct.width, '24.00%');
    assert.equal(pct.height, '16.00%');
});

test('lookupJapaneseWord resolves internal dictionary words, Jisho API responses, and KanjiAPI fallback', async () => {
    clearLookupCache();
    assert.equal(containsKanji('図書館'), true);
    assert.equal(containsKanji('りんご'), false);
    assert.equal(kanaToRomaji('としょかん'), 'toshokan');

    // 1. Internal dictionary hit
    const internalRes = await lookupJapaneseWord('図書館');
    assert.equal(internalRes.source, 'internal');
    assert.equal(internalRes.reading, 'としょかん');
    assert.ok(internalRes.vi.includes('thư viện'));

    // 2. Jisho API response parsing & fetch
    const mockJishoJson = {
        data: [
            {
                slug: '漫画',
                jlpt: ['jlpt-n3'],
                japanese: [{ word: '漫画', reading: 'まんが' }],
                senses: [
                    {
                        english_definitions: ['manga', 'Japanese comics', 'cartoon'],
                        parts_of_speech: ['Noun'],
                    },
                ],
            },
        ],
    };
    const parsedJisho = parseJishoResponse(mockJishoJson, '漫画');
    assert.ok(parsedJisho);
    assert.equal(parsedJisho.word, '漫画');
    assert.equal(parsedJisho.reading, 'まんが');
    assert.equal(parsedJisho.romaji, 'manga');
    assert.equal(parsedJisho.jlpt, 'N3');
    assert.ok(parsedJisho.en.includes('manga'));

    // 3. KanjiAPI fallback when Jisho returns empty
    clearLookupCache();
    const kanjiApiRes = await lookupJapaneseWord('冒険', {
        sourceSentence: '新しい冒険が始まる。',
        fetchImpl: async url => {
            const urlStr = String(url);
            if (urlStr.includes('kanjiapi.dev/v1/kanji/')) {
                return new Response(
                    JSON.stringify({
                        kanji: '冒',
                        grade: 8,
                        stroke_count: 9,
                        meanings: ['risk', 'face', 'defy'],
                        kun_readings: ['おか.す'],
                        on_readings: ['ボウ'],
                        name_readings: [],
                        jlpt: 2,
                        unicode: '5192',
                    }),
                    { status: 200 }
                );
            }
            if (urlStr.includes('kanjiapi.dev/v1/words/')) {
                return new Response(
                    JSON.stringify([
                        {
                            variants: [{ written: '冒険', pronounced: 'ぼうけん' }],
                            meanings: [{ glosses: ['adventure', 'venture'] }],
                        },
                    ]),
                    { status: 200 }
                );
            }
            return new Response(JSON.stringify({ data: [] }), { status: 200 });
        },
    });
    assert.equal(kanjiApiRes.source, 'kanjiapi');
    assert.equal(kanjiApiRes.reading, 'ぼうけん');
    assert.equal(kanjiApiRes.romaji, 'bouken');
    assert.equal(kanjiApiRes.jlpt, 'N2');
    assert.ok(kanjiApiRes.en.includes('adventure'));

    const cardWord = lookupResultToWord(kanjiApiRes);
    assert.equal(cardWord.jp, '冒険');
    assert.equal(cardWord.kana, 'ぼうけん');
    assert.equal(cardWord.level, 'N2');
    assert.equal(cardWord.example, '新しい冒険が始まる。');
});
