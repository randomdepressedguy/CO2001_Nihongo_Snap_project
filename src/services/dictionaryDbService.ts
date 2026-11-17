import { openDB, type IDBPDatabase } from 'idb';
import MiniSearch from 'minisearch';
import * as wanakana from 'wanakana';

import rawVocabData from '../data/jlpt_vocab_n5_n4.json' with { type: 'json' };
import rawKanjiData from '../data/jlpt_kanji_n5_n4.json' with { type: 'json' };
import rawGrammarData from '../data/jlpt_grammar_n5_n4.json' with { type: 'json' };
import type { Word } from '../../lib/study/core.ts';

export interface VocabExample {
  ja: string;
  furigana: string;
  vi: string;
  en: string;
}

export interface VocabEntry {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  hanViet: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  pos: string[];
  meanings: {
    vi: string[];
    en: string[];
  };
  examples: VocabExample[];
}

export interface KanjiEntry {
  character: string;
  hanViet: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  strokes: number;
  radical: string;
  onyomi: string[];
  kunyomi: string[];
  meanings: {
    vi: string[];
    en: string[];
  };
  examples: string[];
}

export interface GrammarExample {
  ja: string;
  furigana: string;
  vi: string;
  en: string;
}

export interface GrammarEntry {
  id: string;
  title: string;
  reading: string;
  romaji: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  meaning: {
    vi: string;
    en: string;
  };
  formation: string[];
  explanation: string;
  notes: string;
  examples: GrammarExample[];
}

export type DictionaryCategory = 'all' | 'vocab' | 'kanji' | 'grammar';
export type JlptLevelFilter = 'ALL' | 'N5' | 'N4';

export interface UnifiedSearchResult {
  uid: string;
  category: 'vocab' | 'kanji' | 'grammar';
  jlpt: string;
  score: number;
  vocab?: VocabEntry;
  kanji?: KanjiEntry;
  grammar?: GrammarEntry;
}

export interface SearchQueryOptions {
  category?: DictionaryCategory;
  jlpt?: JlptLevelFilter;
  limit?: number;
}

export interface SearchExecutionReport {
  results: UnifiedSearchResult[];
  vocab: VocabEntry[];
  kanji: KanjiEntry[];
  grammar: GrammarEntry[];
  elapsedMs: number;
  source: 'local' | 'online-fallback';
}

export const DB_NAME = 'nihongo_snap_db';
export const DB_VERSION = 1;

export const INITIAL_VOCAB: VocabEntry[] = rawVocabData as VocabEntry[];
export const INITIAL_KANJI: KanjiEntry[] = rawKanjiData as KanjiEntry[];
export const INITIAL_GRAMMAR: GrammarEntry[] = rawGrammarData as GrammarEntry[];

// Runtime mutable collections (updated if hybrid online fallback caches new N3-N1 entries)
const vocabMap = new Map<string, VocabEntry>();
const vocabByWordMap = new Map<string, VocabEntry>();
const kanjiMap = new Map<string, KanjiEntry>();
const grammarMap = new Map<string, GrammarEntry>();

for (const v of INITIAL_VOCAB) {
  vocabMap.set(v.id, v);
  if (!vocabByWordMap.has(v.word)) {
    vocabByWordMap.set(v.word, v);
  }
}
for (const k of INITIAL_KANJI) {
  kanjiMap.set(k.character, k);
}
for (const g of INITIAL_GRAMMAR) {
  grammarMap.set(g.id, g);
}

/**
 * Strip Vietnamese diacritics & normalize case/width for <5ms accent-insensitive matching
 */
export function stripVietnameseDiacritics(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[〜～~・。、！？.!?,;/()[\]「」『』]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert query to Hiragana safely when input is Romaji or Katakana
 */
export function toHiraganaSafe(input: string): string {
  const clean = input.trim();
  if (!clean) return '';
  try {
    if (wanakana.isRomaji(clean) || wanakana.isKatakana(clean) || wanakana.isMixed(clean)) {
      return wanakana.toHiragana(clean, { passRomaji: false });
    }
    return clean;
  } catch {
    return clean;
  }
}

interface IndexedDocument {
  uid: string;
  category: 'vocab' | 'kanji' | 'grammar';
  jlpt: string;
  primaryText: string;
  readingText: string;
  romajiText: string;
  hanVietText: string;
  hanVietPlain: string;
  meaningVi: string;
  meaningViPlain: string;
  meaningEn: string;
  extraText: string;
}

let miniSearchInstance: MiniSearch<IndexedDocument> | null = null;
const indexedUids = new Set<string>();

function toIndexedDocFromVocab(v: VocabEntry): IndexedDocument {
  const viJoined = v.meanings.vi.join(' ');
  const enJoined = v.meanings.en.join(' ');
  return {
    uid: `vocab:${v.id}`,
    category: 'vocab',
    jlpt: v.jlpt,
    primaryText: v.word,
    readingText: `${v.reading} ${wanakana.toKatakana(v.reading)}`,
    romajiText: v.romaji,
    hanVietText: v.hanViet.toLowerCase(),
    hanVietPlain: stripVietnameseDiacritics(v.hanViet),
    meaningVi: viJoined.toLowerCase(),
    meaningViPlain: stripVietnameseDiacritics(viJoined),
    meaningEn: enJoined.toLowerCase(),
    extraText: v.pos.join(' ')
  };
}

function toIndexedDocFromKanji(k: KanjiEntry): IndexedDocument {
  const viJoined = k.meanings.vi.join(' ');
  const enJoined = k.meanings.en.join(' ');
  const onHira = k.onyomi.map(r => wanakana.toHiragana(r)).join(' ');
  const kunClean = k.kunyomi.map(r => r.replace(/\./g, '')).join(' ');
  const romaji = wanakana.toRomaji(`${onHira} ${kunClean}`);
  return {
    uid: `kanji:${k.character}`,
    category: 'kanji',
    jlpt: k.jlpt,
    primaryText: `${k.character} ${k.examples.join(' ')}`,
    readingText: `${k.onyomi.join(' ')} ${onHira} ${k.kunyomi.join(' ')} ${kunClean}`,
    romajiText: romaji.toLowerCase(),
    hanVietText: k.hanViet.toLowerCase(),
    hanVietPlain: stripVietnameseDiacritics(k.hanViet),
    meaningVi: viJoined.toLowerCase(),
    meaningViPlain: stripVietnameseDiacritics(viJoined),
    meaningEn: enJoined.toLowerCase(),
    extraText: `${k.radical} ${k.strokes}`
  };
}

function toIndexedDocFromGrammar(g: GrammarEntry): IndexedDocument {
  const cleanTitle = g.title.replace(/^[〜～~]/, '').trim();
  return {
    uid: `grammar:${g.id}`,
    category: 'grammar',
    jlpt: g.jlpt,
    primaryText: `${g.title} ${cleanTitle}`,
    readingText: g.reading,
    romajiText: g.romaji.toLowerCase(),
    hanVietText: '',
    hanVietPlain: '',
    meaningVi: g.meaning.vi.toLowerCase(),
    meaningViPlain: stripVietnameseDiacritics(g.meaning.vi),
    meaningEn: g.meaning.en.toLowerCase(),
    extraText: `${g.explanation} ${stripVietnameseDiacritics(g.explanation)} ${g.formation.join(' ')}`
  };
}

function ensureMiniSearch(): MiniSearch<IndexedDocument> {
  if (miniSearchInstance) return miniSearchInstance;

  const ms = new MiniSearch<IndexedDocument>({
    idField: 'uid',
    fields: [
      'primaryText',
      'readingText',
      'romajiText',
      'hanVietText',
      'hanVietPlain',
      'meaningVi',
      'meaningViPlain',
      'meaningEn',
      'extraText'
    ],
    storeFields: ['uid', 'category', 'jlpt'],
    searchOptions: {
      boost: {
        primaryText: 6,
        readingText: 5,
        romajiText: 5,
        hanVietText: 5,
        hanVietPlain: 4.5,
        meaningVi: 3.5,
        meaningViPlain: 3,
        meaningEn: 3,
        extraText: 1
      },
      prefix: true,
      fuzzy: 0.2
    }
  });

  const docs: IndexedDocument[] = [];
  for (const v of vocabMap.values()) {
    const doc = toIndexedDocFromVocab(v);
    indexedUids.add(doc.uid);
    docs.push(doc);
  }
  for (const k of kanjiMap.values()) {
    const doc = toIndexedDocFromKanji(k);
    indexedUids.add(doc.uid);
    docs.push(doc);
  }
  for (const g of grammarMap.values()) {
    const doc = toIndexedDocFromGrammar(g);
    indexedUids.add(doc.uid);
    docs.push(doc);
  }

  ms.addAll(docs);
  miniSearchInstance = ms;
  return ms;
}

// ============================================================================
// IndexedDB Initialization & Background Hydration (nihongo_snap_db v1)
// ============================================================================

let dbPromise: Promise<IDBPDatabase | null> | null = null;
let hydrationStatus: 'idle' | 'hydrating' | 'ready' | 'unsupported' = 'idle';

export function getHydrationStatus() {
  return hydrationStatus;
}

export async function initDictionaryDb(): Promise<IDBPDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    hydrationStatus = 'unsupported';
    ensureMiniSearch();
    return null;
  }

  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    try {
      ensureMiniSearch();
      const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(database) {
          if (!database.objectStoreNames.contains('vocab')) {
            const vocabStore = database.createObjectStore('vocab', { keyPath: 'id' });
            vocabStore.createIndex('word', 'word', { unique: false });
            vocabStore.createIndex('reading', 'reading', { unique: false });
            vocabStore.createIndex('jlpt', 'jlpt', { unique: false });
            vocabStore.createIndex('hanViet', 'hanViet', { unique: false });
          }
          if (!database.objectStoreNames.contains('kanji')) {
            const kanjiStore = database.createObjectStore('kanji', { keyPath: 'character' });
            kanjiStore.createIndex('jlpt', 'jlpt', { unique: false });
            kanjiStore.createIndex('hanViet', 'hanViet', { unique: false });
            kanjiStore.createIndex('strokes', 'strokes', { unique: false });
          }
          if (!database.objectStoreNames.contains('grammar')) {
            const grammarStore = database.createObjectStore('grammar', { keyPath: 'id' });
            grammarStore.createIndex('title', 'title', { unique: false });
            grammarStore.createIndex('jlpt', 'jlpt', { unique: false });
            grammarStore.createIndex('romaji', 'romaji', { unique: false });
          }
        }
      });

      // Check if stores already hydrated
      const [vocabCount, kanjiCount, grammarCount] = await Promise.all([
        db.count('vocab'),
        db.count('kanji'),
        db.count('grammar')
      ]);

      if (
        vocabCount < INITIAL_VOCAB.length ||
        kanjiCount < INITIAL_KANJI.length ||
        grammarCount < INITIAL_GRAMMAR.length
      ) {
        hydrationStatus = 'hydrating';
        // Non-blocking background transaction
        void (async () => {
          try {
            const tx = db.transaction(['vocab', 'kanji', 'grammar'], 'readwrite');
            const vStore = tx.objectStore('vocab');
            const kStore = tx.objectStore('kanji');
            const gStore = tx.objectStore('grammar');

            for (const v of INITIAL_VOCAB) {
              void vStore.put(v);
            }
            for (const k of INITIAL_KANJI) {
              void kStore.put(k);
            }
            for (const g of INITIAL_GRAMMAR) {
              void gStore.put(g);
            }
            await tx.done;
            hydrationStatus = 'ready';
          } catch {
            hydrationStatus = 'ready';
          }
        })();
      } else {
        hydrationStatus = 'ready';
        // Load any cached online-fallback items stored in IndexedDB beyond initial bundle
        void (async () => {
          try {
            const [allV, allK] = await Promise.all([db.getAll('vocab'), db.getAll('kanji')]);
            const ms = ensureMiniSearch();
            for (const v of allV as VocabEntry[]) {
              if (!vocabMap.has(v.id)) {
                vocabMap.set(v.id, v);
                vocabByWordMap.set(v.word, v);
                const doc = toIndexedDocFromVocab(v);
                if (!indexedUids.has(doc.uid)) {
                  indexedUids.add(doc.uid);
                  ms.add(doc);
                }
              }
            }
            for (const k of allK as KanjiEntry[]) {
              if (!kanjiMap.has(k.character)) {
                kanjiMap.set(k.character, k);
                const doc = toIndexedDocFromKanji(k);
                if (!indexedUids.has(doc.uid)) {
                  indexedUids.add(doc.uid);
                  ms.add(doc);
                }
              }
            }
          } catch {
            // Ignore background read errors
          }
        })();
      }

      return db;
    } catch {
      hydrationStatus = 'unsupported';
      return null;
    }
  })();

  return dbPromise;
}

// ============================================================================
// Multi-Category Instant Search (< 5ms)
// ============================================================================

function resolveUidToResult(uid: string, score: number): UnifiedSearchResult | null {
  if (uid.startsWith('vocab:')) {
    const id = uid.slice(6);
    const v = vocabMap.get(id);
    if (!v) return null;
    return { uid, category: 'vocab', jlpt: v.jlpt, score, vocab: v };
  }
  if (uid.startsWith('kanji:')) {
    const ch = uid.slice(6);
    const k = kanjiMap.get(ch);
    if (!k) return null;
    return { uid, category: 'kanji', jlpt: k.jlpt, score, kanji: k };
  }
  if (uid.startsWith('grammar:')) {
    const id = uid.slice(8);
    const g = grammarMap.get(id);
    if (!g) return null;
    return { uid, category: 'grammar', jlpt: g.jlpt, score, grammar: g };
  }
  return null;
}

export function searchDictionary(
  query: string,
  options: SearchQueryOptions = {}
): SearchExecutionReport {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const category = options.category ?? 'all';
  const jlpt = options.jlpt ?? 'ALL';
  const limit = options.limit ?? 300;

  const trimmed = query.trim();

  // If no query, return filtered browsing list immediately
  if (!trimmed) {
    const vocabList =
      category === 'all' || category === 'vocab'
        ? Array.from(vocabMap.values()).filter(v => jlpt === 'ALL' || v.jlpt === jlpt)
        : [];
    const kanjiList =
      category === 'all' || category === 'kanji'
        ? Array.from(kanjiMap.values()).filter(k => jlpt === 'ALL' || k.jlpt === jlpt)
        : [];
    const grammarList =
      category === 'all' || category === 'grammar'
        ? Array.from(grammarMap.values()).filter(g => jlpt === 'ALL' || g.jlpt === jlpt)
        : [];

    const results: UnifiedSearchResult[] = [
      ...vocabList.slice(0, limit).map(v => ({
        uid: `vocab:${v.id}`,
        category: 'vocab' as const,
        jlpt: v.jlpt,
        score: 1,
        vocab: v
      })),
      ...kanjiList.slice(0, limit).map(k => ({
        uid: `kanji:${k.character}`,
        category: 'kanji' as const,
        jlpt: k.jlpt,
        score: 1,
        kanji: k
      })),
      ...grammarList.slice(0, limit).map(g => ({
        uid: `grammar:${g.id}`,
        category: 'grammar' as const,
        jlpt: g.jlpt,
        score: 1,
        grammar: g
      }))
    ];

    const elapsedMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start;
    return {
      results: results.slice(0, limit),
      vocab: vocabList,
      kanji: kanjiList,
      grammar: grammarList,
      elapsedMs,
      source: 'local'
    };
  }

  const ms = ensureMiniSearch();
  const qPlain = stripVietnameseDiacritics(trimmed);
  const qHira = toHiraganaSafe(trimmed);
  const qRomaji = wanakana.toRomaji(qHira).toLowerCase().trim();

  const scoreMap = new Map<string, number>();
  const addScore = (uid: string, points: number) => {
    scoreMap.set(uid, (scoreMap.get(uid) ?? 0) + points);
  };

  const filterFn = (doc: Record<string, unknown>) => {
    if (category !== 'all' && doc.category !== category) return false;
    if (jlpt !== 'ALL' && doc.jlpt !== jlpt) return false;
    return true;
  };

  // 1. O(1) exact Kanji & Vocab headword boost
  if (category === 'all' || category === 'kanji') {
    for (const ch of trimmed) {
      const k = kanjiMap.get(ch);
      if (k && (jlpt === 'ALL' || k.jlpt === jlpt)) {
        addScore(`kanji:${k.character}`, 150);
      }
    }
  }

  if (category === 'all' || category === 'vocab') {
    const exactWord = vocabByWordMap.get(trimmed);
    if (exactWord && (jlpt === 'ALL' || exactWord.jlpt === jlpt)) {
      addScore(`vocab:${exactWord.id}`, 250);
    }
  }

  // 2. MiniSearch sub-millisecond inverted index lookup across original, accent-stripped, and Hiragana
  const searchVariants = Array.from(new Set([trimmed, qPlain, qHira, qRomaji].filter(Boolean)));
  for (const variant of searchVariants) {
    const hits = ms.search(variant, { filter: filterFn });
    for (const hit of hits) {
      addScore(hit.id, hit.score);
    }
  }

  const rankedUids = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  const results: UnifiedSearchResult[] = [];
  const vocabResults: VocabEntry[] = [];
  const kanjiResults: KanjiEntry[] = [];
  const grammarResults: GrammarEntry[] = [];

  for (const [uid, score] of rankedUids) {
    const resolved = resolveUidToResult(uid, score);
    if (!resolved) continue;
    results.push(resolved);
    if (resolved.vocab) vocabResults.push(resolved.vocab);
    if (resolved.kanji) kanjiResults.push(resolved.kanji);
    if (resolved.grammar) grammarResults.push(resolved.grammar);
  }

  const elapsedMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start;
  return {
    results,
    vocab: vocabResults,
    kanji: kanjiResults,
    grammar: grammarResults,
    elapsedMs,
    source: 'local'
  };
}

// ============================================================================
// Hybrid Online Fallback (KanjiAPI.dev + Jisho-compatible API -> IndexedDB Cache)
// ============================================================================

export async function searchWithOnlineFallback(
  query: string,
  options: SearchQueryOptions = {},
  fetchImpl?: typeof fetch
): Promise<SearchExecutionReport> {
  const localReport = searchDictionary(query, options);
  const trimmed = query.trim();
  if (!trimmed || localReport.results.length > 0) {
    return localReport;
  }

  const fetcher = fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);
  if (!fetcher) return localReport;

  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const addedKanji: KanjiEntry[] = [];
  const addedVocab: VocabEntry[] = [];
  const ms = ensureMiniSearch();
  const db = await initDictionaryDb();

  // 1. If query contains an unindexed Kanji character (e.g., N3-N1 Kanji), fetch from KanjiAPI.dev
  const kanjiChars = Array.from(trimmed).filter(ch => wanakana.isKanji(ch) && !kanjiMap.has(ch));
  for (const ch of kanjiChars.slice(0, 2)) {
    try {
      const res = await fetcher(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(ch)}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const data = (await res.json()) as {
          kanji?: string;
          jlpt?: number | null;
          stroke_count?: number;
          meanings?: string[];
          on_readings?: string[];
          kun_readings?: string[];
        };
        const entry: KanjiEntry = {
          character: data.kanji || ch,
          hanViet: 'HÁN TỰ (NÂNG CAO)',
          jlpt: data.jlpt ? `N${data.jlpt}` : 'N1',
          strokes: data.stroke_count || 10,
          radical: ch,
          onyomi: data.on_readings || [],
          kunyomi: data.kun_readings || [],
          meanings: {
            vi: (data.meanings || [ch]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
            en: data.meanings || [ch]
          },
          examples: [ch]
        };
        kanjiMap.set(entry.character, entry);
        const doc = toIndexedDocFromKanji(entry);
        if (!indexedUids.has(doc.uid)) {
          indexedUids.add(doc.uid);
          ms.add(doc);
        }
        if (db) {
          await db.put('kanji', entry).catch(() => {});
        }
        addedKanji.push(entry);
      }
    } catch {
      // Ignore KanjiAPI error and try word fallback
    }
  }

  // 2. Try KanjiAPI words endpoint or Jisho API fallback for N3-N1 vocabulary
  if (kanjiChars.length > 0) {
    try {
      const targetKanji = kanjiChars[0];
      const res = await fetcher(`https://kanjiapi.dev/v1/words/${encodeURIComponent(targetKanji)}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const wordsData = (await res.json()) as Array<{
          variants?: Array<{ written?: string; pronounced?: string }>;
          meanings?: Array<{ glosses?: string[] }>;
        }>;
        const matching = wordsData
          .filter(item => item.variants?.some(v => v.written === trimmed || v.written?.includes(trimmed)))
          .slice(0, 3);
        const candidates = matching.length > 0 ? matching : wordsData.slice(0, 2);

        for (const item of candidates) {
          const variant = item.variants?.[0];
          const written = variant?.written || trimmed;
          const pronounced = wanakana.toHiragana(variant?.pronounced || written);
          const glosses = item.meanings?.flatMap(m => m.glosses || []).slice(0, 4) || [trimmed];
          const id = `v_online_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
          const vocabEntry: VocabEntry = {
            id,
            word: written,
            reading: pronounced,
            romaji: wanakana.toRomaji(pronounced).toLowerCase(),
            hanViet: '',
            jlpt: 'N3+',
            pos: ['noun'],
            meanings: {
              vi: glosses.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
              en: glosses
            },
            examples: [
              {
                ja: `「${written}」の意味を調べました。`,
                furigana: `「${pronounced}」のいみをしらべました。`,
                vi: `Tôi đã tra cứu ý nghĩa của từ "${written}".`,
                en: `I looked up the meaning of "${written}".`
              }
            ]
          };
          vocabMap.set(vocabEntry.id, vocabEntry);
          vocabByWordMap.set(vocabEntry.word, vocabEntry);
          const doc = toIndexedDocFromVocab(vocabEntry);
          if (!indexedUids.has(doc.uid)) {
            indexedUids.add(doc.uid);
            ms.add(doc);
          }
          if (db) {
            await db.put('vocab', vocabEntry).catch(() => {});
          }
          addedVocab.push(vocabEntry);
        }
      }
    } catch {
      // Ignore network errors
    }
  }

  const results: UnifiedSearchResult[] = [
    ...addedVocab.map(v => ({
      uid: `vocab:${v.id}`,
      category: 'vocab' as const,
      jlpt: v.jlpt,
      score: 100,
      vocab: v
    })),
    ...addedKanji.map(k => ({
      uid: `kanji:${k.character}`,
      category: 'kanji' as const,
      jlpt: k.jlpt,
      score: 95,
      kanji: k
    }))
  ];

  const elapsedMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start;
  return {
    results,
    vocab: addedVocab,
    kanji: addedKanji,
    grammar: [],
    elapsedMs,
    source: results.length > 0 ? 'online-fallback' : 'local'
  };
}

// ============================================================================
// Converters to Study Word / Flashcard Format
// ============================================================================

export function vocabEntryToStudyWord(v: VocabEntry): Word {
  const ex = v.examples[0] ?? {
    ja: `${v.word}を使います。`,
    furigana: `${v.reading}をつかいます。`,
    vi: v.meanings.vi.join(', '),
    en: v.meanings.en.join(', ')
  };
  return {
    id: v.id,
    jp: v.word,
    kana: v.reading,
    romaji: v.romaji,
    vi: v.meanings.vi.join('; '),
    en: v.meanings.en.join('; '),
    tag: v.pos[0] || v.jlpt,
    level: v.jlpt,
    example: ex.ja,
    exampleVi: ex.vi,
    exampleEn: ex.en
  };
}

export function kanjiEntryToStudyWord(k: KanjiEntry): Word {
  const primaryReading = k.kunyomi[0]?.replace(/\./g, '') || wanakana.toHiragana(k.onyomi[0] || k.character);
  const romaji = wanakana.toRomaji(primaryReading).toLowerCase();
  const compounds = k.examples.join('・');
  return {
    id: `kanji_${k.character}`,
    jp: k.character,
    kana: primaryReading,
    romaji,
    vi: `[Hán Việt: ${k.hanViet}] ${k.meanings.vi.join('; ')}`,
    en: k.meanings.en.join('; '),
    tag: 'kanji',
    level: k.jlpt,
    example: `代表語: ${compounds}`,
    exampleVi: `Từ ghép tiêu biểu: ${compounds}`,
    exampleEn: `Common compounds: ${compounds}`
  };
}

export function grammarEntryToStudyWord(g: GrammarEntry): Word {
  const ex = g.examples[0] ?? {
    ja: g.title,
    furigana: g.reading,
    vi: g.meaning.vi,
    en: g.meaning.en
  };
  return {
    id: g.id,
    jp: g.title,
    kana: g.reading,
    romaji: g.romaji,
    vi: g.meaning.vi,
    en: g.meaning.en,
    tag: 'grammar',
    level: g.jlpt,
    example: ex.ja,
    exampleVi: ex.vi,
    exampleEn: ex.en
  };
}

export function getAllVocab(): VocabEntry[] {
  return Array.from(vocabMap.values());
}

export function getAllKanji(): KanjiEntry[] {
  return Array.from(kanjiMap.values());
}

export function getAllGrammar(): GrammarEntry[] {
  return Array.from(grammarMap.values());
}

export function getKanjiByChar(char: string): KanjiEntry | undefined {
  return kanjiMap.get(char);
}

export function getVocabByWord(word: string): VocabEntry | undefined {
  return vocabByWordMap.get(word);
}

export function getDatabaseStats() {
  return {
    vocabTotal: vocabMap.size,
    vocabN5: Array.from(vocabMap.values()).filter(v => v.jlpt === 'N5').length,
    vocabN4: Array.from(vocabMap.values()).filter(v => v.jlpt === 'N4').length,
    kanjiTotal: kanjiMap.size,
    kanjiN5: Array.from(kanjiMap.values()).filter(k => k.jlpt === 'N5').length,
    kanjiN4: Array.from(kanjiMap.values()).filter(k => k.jlpt === 'N4').length,
    grammarTotal: grammarMap.size,
    grammarN5: Array.from(grammarMap.values()).filter(g => g.jlpt === 'N5').length,
    grammarN4: Array.from(grammarMap.values()).filter(g => g.jlpt === 'N4').length
  };
}
