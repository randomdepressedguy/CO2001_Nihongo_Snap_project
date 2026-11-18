import test from 'node:test';
import assert from 'node:assert/strict';
import {
    RADICALS_DATA,
    kanjiToHex,
    getKanjiVgUrl,
    getKanjiApiUrl,
    parseKanjiVgSvg,
    fetchKanjiStrokes,
    fetchKanjiMetadata,
    getKanjiRadicals,
    getRadicalsByStrokeCount,
    searchKanjiByRadicals,
    validateTracingStroke,
} from '../src/services/kanjiService.ts';

test('kanjiToHex and getKanjiVgUrl format 5-digit lowercase hex Unicode code point', () => {
    assert.equal(kanjiToHex('休'), '04f11');
    assert.equal(kanjiToHex('語'), '08a9e');
    assert.equal(kanjiToHex('校'), '06821');
    assert.equal(kanjiToHex('あ'), '03042');
    assert.equal(
        getKanjiVgUrl('休'),
        'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/04f11.svg'
    );
});

test('TC-01: parseKanjiVgSvg and fetchKanjiStrokes extract sequential paths (s1..sN) and stroke number coordinates', async () => {
    const strokeData = await fetchKanjiStrokes('休', {
        bypassCache: true,
        fetchImpl: async () => {
            throw new Error('Offline test fallback');
        },
    });
    assert.equal(strokeData.kanji, '休');
    assert.equal(strokeData.hex, '04f11');
    assert.equal(strokeData.strokes.length, 6);
    assert.deepEqual(
        strokeData.strokes.map(s => s.index),
        [1, 2, 3, 4, 5, 6]
    );
    assert.equal(strokeData.strokes[0].id, 'kvg:04f11-s1');
    assert.ok(strokeData.strokes[0].length > 10);
    assert.ok(Number.isFinite(strokeData.strokes[0].numberPos.x));
    assert.ok(Number.isFinite(strokeData.strokes[0].numberPos.y));

    // Also test out-of-order SVG XML sorting
    const customXml = `<svg viewBox="0 0 109 109">
        <path id="kvg:04eba-s2" d="M46,54 L82,84"/>
        <path id="kvg:04eba-s1" d="M54,20 L16,87"/>
        <text transform="matrix(1 0 0 1 45.50 19.50)">1</text>
        <text transform="matrix(1 0 0 1 52.50 55.50)">2</text>
    </svg>`;
    const parsed = parseKanjiVgSvg(customXml, '人');
    assert.equal(parsed.strokes.length, 2);
    assert.equal(parsed.strokes[0].id, 'kvg:04eba-s1');
    assert.equal(parsed.strokes[1].id, 'kvg:04eba-s2');
    assert.deepEqual(parsed.strokes[0].numberPos, { x: 45.5, y: 19.5 });
});

test('TC-02: validateTracingStroke accepts valid stroke order/direction and rejects reverse or wrong-order strokes', async () => {
    const strokeData = await fetchKanjiStrokes('休');
    const firstStroke = strokeData.strokes[0]; // 亻 top-right to bottom-left
    const secondStroke = strokeData.strokes[1];

    // 1. Correct direction and within 25 viewBox units tolerance
    const validResult = validateTracingStroke(
        [
            { x: firstStroke.startPoint.x + 2, y: firstStroke.startPoint.y + 2 },
            {
                x: (firstStroke.startPoint.x + firstStroke.endPoint.x) / 2,
                y: (firstStroke.startPoint.y + firstStroke.endPoint.y) / 2,
            },
            { x: firstStroke.endPoint.x - 1, y: firstStroke.endPoint.y - 1 },
        ],
        firstStroke
    );
    assert.equal(validResult.valid, true);
    assert.equal(validResult.reason, 'ok');
    assert.ok(validResult.accuracy >= 60);

    // 2. Reverse direction (drawing from endPoint back to startPoint)
    const reverseResult = validateTracingStroke(
        [
            { x: firstStroke.endPoint.x, y: firstStroke.endPoint.y },
            { x: firstStroke.startPoint.x, y: firstStroke.startPoint.y },
        ],
        firstStroke
    );
    assert.equal(reverseResult.valid, false);
    assert.equal(reverseResult.reason, 'reverse_direction');

    // 3. Wrong stroke order (drawing stroke 4 on the right side while target is stroke 1 on the left)
    const wrongOrderStroke = strokeData.strokes[3];
    const wrongOrderResult = validateTracingStroke(
        [
            { x: wrongOrderStroke.startPoint.x, y: wrongOrderStroke.startPoint.y },
            { x: wrongOrderStroke.endPoint.x, y: wrongOrderStroke.endPoint.y },
        ],
        secondStroke
    );
    assert.equal(wrongOrderResult.valid, false);
    assert.equal(wrongOrderResult.reason, 'wrong_order_or_position');
});

test('TC-03: getKanjiRadicals returns constituent radicals with Vietnamese names and stroke counts for 休, 語, 校', () => {
    const groups = getRadicalsByStrokeCount();
    assert.equal(groups.length, 17);
    assert.equal(groups[0].strokes, 1);
    assert.equal(groups[groups.length - 1].strokes, 17);
    assert.ok(RADICALS_DATA.length >= 214);

    // 休 = 亻 (Nhân đứng - 2 nét) + 木 (Mộc - 4 nét)
    const yasumuRads = getKanjiRadicals('休');
    assert.ok(yasumuRads.some(r => r.radical === '亻' && r.nameVi === 'Nhân đứng' && r.strokes === 2));
    assert.ok(yasumuRads.some(r => r.radical === '木' && r.nameVi === 'Mộc' && r.strokes === 4));

    // 語 = 言 (Ngôn - 7 nét) + 口 (Khẩu - 3 nét)
    const goRads = getKanjiRadicals('語');
    assert.ok(goRads.some(r => r.radical === '言' && r.nameVi === 'Ngôn' && r.strokes === 7));
    assert.ok(goRads.some(r => r.radical === '口' && r.nameVi === 'Khẩu' && r.strokes === 3));

    // 校 = 木 (Mộc - 4 nét) + 亠 (Đầu - 2 nét) + 父 (Phụ - 4 nét)
    const kouRads = getKanjiRadicals('校');
    assert.ok(kouRads.some(r => r.radical === '木' && r.nameVi === 'Mộc' && r.strokes === 4));
    assert.ok(kouRads.some(r => r.radical === '亠' && r.nameVi === 'Đầu' && r.strokes === 2));
    assert.ok(kouRads.some(r => r.radical === '父' && r.nameVi === 'Phụ' && r.strokes === 4));
});

test('TC-04: searchKanjiByRadicals computes real-time intersection and dims incompatible radicals', () => {
    const res = searchKanjiByRadicals(['亻', '木']);
    assert.ok(res.matchedKanji.includes('休'));
    assert.ok(res.matchedKanji.includes('体'));
    assert.ok(res.groupedByStrokes.some(g => g.strokes === 6 && g.items.some(i => i.kanji === '休')));
    assert.ok(res.groupedByStrokes.some(g => g.strokes === 7 && g.items.some(i => i.kanji === '体')));

    // Compatible radicals must include 亻 and 木, while unrelated radicals like 魚 or 雨 are excluded (dimmed)
    assert.ok(res.compatibleRadicals.has('亻'));
    assert.ok(res.compatibleRadicals.has('木'));
    assert.equal(res.compatibleRadicals.has('魚'), false);
    assert.equal(res.compatibleRadicals.has('雨'), false);
});

test('fetchKanjiMetadata enriches local N5-N4 data with KanjiAPI.dev schema', async () => {
    assert.equal(getKanjiApiUrl('休'), 'https://kanjiapi.dev/v1/kanji/%E4%BC%91');
    const meta = await fetchKanjiMetadata('休', {
        fetchImpl: async () =>
            new Response(
                JSON.stringify({
                    kanji: '休',
                    grade: 1,
                    stroke_count: 6,
                    meanings: ['rest', 'day off', 'retire', 'sleep'],
                    kun_readings: ['やす.む', 'やす.まる', 'やす.める'],
                    on_readings: ['キュウ'],
                    jlpt: 5,
                    heisig_en: 'rest',
                }),
                { status: 200 }
            ),
    });
    assert.equal(meta.kanji, '休');
    assert.equal(meta.stroke_count, 6);
    assert.equal(meta.hanViet, 'HƯU');
    assert.equal(meta.jlpt, 5);
    assert.equal(meta.heisig_en, 'rest');
    assert.ok(meta.on_readings.includes('キュウ'));
    assert.ok(meta.kun_readings.includes('やす.む'));
});
