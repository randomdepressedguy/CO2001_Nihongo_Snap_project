import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  INITIAL_VOCAB,
  INITIAL_KANJI,
  INITIAL_GRAMMAR,
  getDatabaseStats,
  searchDictionary,
  searchWithOnlineFallback,
  vocabEntryToStudyWord,
  kanjiEntryToStudyWord,
  grammarEntryToStudyWord
} from '../src/services/dictionaryDbService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

test('TC-01 (Seed Data Integrity): Verify vocab >= 1200, kanji >= 250, grammar >= 115 and valid schemas', async () => {
  const [vocabRaw, kanjiRaw, grammarRaw] = await Promise.all([
    fs.readFile(path.join(DATA_DIR, 'jlpt_vocab_n5_n4.json'), 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'jlpt_kanji_n5_n4.json'), 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'jlpt_grammar_n5_n4.json'), 'utf8')
  ]);

  const vocab = JSON.parse(vocabRaw);
  const kanji = JSON.parse(kanjiRaw);
  const grammar = JSON.parse(grammarRaw);

  assert.ok(Array.isArray(vocab) && vocab.length >= 1200, `Expected vocab >= 1200, got ${vocab.length}`);
  assert.ok(Array.isArray(kanji) && kanji.length >= 250, `Expected kanji >= 250, got ${kanji.length}`);
  assert.ok(Array.isArray(grammar) && grammar.length >= 115, `Expected grammar >= 115, got ${grammar.length}`);

  // Verify specific schema fields on 約束
  const yakusoku = vocab.find(v => v.word === '約束');
  assert.ok(yakusoku, '約束 should exist in jlpt_vocab_n5_n4.json');
  assert.equal(yakusoku.reading, 'やくそく');
  assert.equal(yakusoku.romaji, 'yakusoku');
  assert.equal(yakusoku.hanViet, 'ƯỚC THÚC');
  assert.equal(yakusoku.jlpt, 'N4');
  assert.ok(yakusoku.meanings.vi.includes('Lời hứa'));
  assert.ok(yakusoku.meanings.en.includes('promise'));
  assert.ok(yakusoku.examples.length >= 1);

  // Verify specific schema fields on 学
  const gaku = kanji.find(k => k.character === '学');
  assert.ok(gaku, '学 should exist in jlpt_kanji_n5_n4.json');
  assert.equal(gaku.hanViet, 'HỌC');
  assert.equal(gaku.jlpt, 'N5');
  assert.equal(gaku.strokes, 8);
  assert.ok(gaku.onyomi.includes('ガク'));

  // Verify specific schema fields on 〜ようになる
  const youNiNaru = grammar.find(g => g.title.includes('ようになる'));
  assert.ok(youNiNaru, '〜ようになる should exist in jlpt_grammar_n5_n4.json');
  assert.equal(youNiNaru.jlpt, 'N4');
  assert.ok(Array.isArray(youNiNaru.formation) && youNiNaru.formation.length >= 1);
  assert.ok(youNiNaru.explanation.length > 10);
  assert.ok(youNiNaru.examples.length >= 1);

  const stats = getDatabaseStats();
  assert.equal(stats.vocabTotal, INITIAL_VOCAB.length);
  assert.equal(stats.kanjiTotal, INITIAL_KANJI.length);
  assert.equal(stats.grammarTotal, INITIAL_GRAMMAR.length);
});

test('TC-03 (Multi-Modal Instant Search): Search by Kanji, Hiragana, Romaji, Han Viet, and Grammar in < 5ms', () => {
  // Warm up index
  searchDictionary('約束');

  const qKanji = searchDictionary('約束');
  assert.ok(qKanji.vocab.some(v => v.word === '約束'), 'Kanji search for 約束 should match');
  assert.ok(qKanji.elapsedMs < 5, `Expected < 5ms instant search, took ${qKanji.elapsedMs}ms`);

  const qHira = searchDictionary('やくそく');
  assert.ok(qHira.vocab.some(v => v.word === '約束'), 'Hiragana search for やくそく should match 約束');

  const qRomaji = searchDictionary('yakusoku');
  assert.ok(qRomaji.vocab.some(v => v.word === '約束'), 'Romaji search for yakusoku should match 約束');

  const qHanVietAccented = searchDictionary('ước thúc');
  assert.ok(qHanVietAccented.vocab.some(v => v.word === '約束'), 'Han Viet search for ước thúc should match 約束');

  const qHanVietUnaccented = searchDictionary('uoc thuc');
  assert.ok(qHanVietUnaccented.vocab.some(v => v.word === '約束'), 'Unaccented Han Viet search for uoc thuc should match 約束');

  const qGrammar = searchDictionary('ようになる');
  assert.ok(qGrammar.grammar.some(g => g.title.includes('ようになる')), 'Grammar search for ようになる should match');

  const qGrammarRomaji = searchDictionary('you ni naru', { category: 'grammar', jlpt: 'N4' });
  assert.ok(qGrammarRomaji.grammar.some(g => g.title.includes('ようになる')), 'Romaji grammar search should match');

  // Verify converters to Study Word format
  const studyW = vocabEntryToStudyWord(qKanji.vocab[0]);
  assert.equal(studyW.jp, '約束');
  const studyK = kanjiEntryToStudyWord(INITIAL_KANJI[0]);
  assert.ok(studyK.jp.length >= 1);
  const studyG = grammarEntryToStudyWord(qGrammar.grammar[0]);
  assert.ok(studyG.jp.includes('ようになる'));
});

test('TC-04 (Hybrid Online Fallback): Fetches and caches unknown N1 Kanji/word via online fallback', async () => {
  const n1Query = '憂鬱';
  const beforeLocal = searchDictionary(n1Query);
  assert.equal(beforeLocal.results.length, 0);

  const fallbackReport = await searchWithOnlineFallback(
    n1Query,
    { category: 'all', jlpt: 'ALL' },
    async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/v1/kanji/')) {
        return new Response(
          JSON.stringify({
            kanji: '憂',
            jlpt: 1,
            stroke_count: 15,
            meanings: ['melancholy', 'grief'],
            on_readings: ['ユウ'],
            kun_readings: ['うれ.える']
          }),
          { status: 200 }
        );
      }
      if (urlStr.includes('/v1/words/')) {
        return new Response(
          JSON.stringify([
            {
              variants: [{ written: '憂鬱', pronounced: 'ゆううつ' }],
              meanings: [{ glosses: ['depression', 'melancholy', 'gloom'] }]
            }
          ]),
          { status: 200 }
        );
      }
      return new Response('{}', { status: 404 });
    }
  );

  assert.equal(fallbackReport.source, 'online-fallback');
  assert.ok(fallbackReport.vocab.some(v => v.word === '憂鬱'));
  assert.ok(fallbackReport.kanji.some(k => k.character === '憂'));

  // Subsequent local search should now find the cached N1 word immediately without network!
  const afterLocal = searchDictionary('憂鬱');
  assert.ok(afterLocal.vocab.some(v => v.word === '憂鬱'));
});
