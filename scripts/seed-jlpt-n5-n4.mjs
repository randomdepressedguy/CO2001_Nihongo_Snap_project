#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as wanakana from 'wanakana';

import { CURATED_KANJI, HAN_VIET_MAP, computeHanViet } from './seed-data/kanji-hanviet.mjs';
import { CURATED_GRAMMAR } from './seed-data/grammar-n5-n4.mjs';
import { PRIORITY_VOCAB, EN_TO_VI_DICT, parseCuratedVocabRows } from './seed-data/vocab-n5-n4.mjs';
import { parseExtendedVocabRows } from './seed-data/vocab-extended.mjs';
import { parseSupplementVocabRows } from './seed-data/vocab-supplement.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

const UPSTREAM_URLS = {
  vocabN5: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n5.json',
    'https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/master/data/results/n5_vocab_cleaned.json'
  ],
  vocabN4: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n4.json',
    'https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/master/data/results/n4_vocab_cleaned.json'
  ],
  kanjiN5: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n5.json'
  ],
  kanjiN4: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n4.json'
  ],
  kanjiJouyou: [
    'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji-jouyou.json'
  ],
  grammarN5: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n5.json'
  ],
  grammarN4: [
    'https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n4.json'
  ],
  grammarFallback: [
    'https://raw.githubusercontent.com/tristcoil/jlpt-grammar-list/master/data/grammar.json'
  ]
};

async function fetchJsonWithFallback(urls, label) {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const data = await res.json();
      console.log(`[seed] Fetched ${label} from ${url}`);
      return data;
    } catch {
      // Try next fallback URL
    }
  }
  console.log(`[seed] Using local curated dataset for ${label} (upstream unreachable or offline)`);
  return null;
}

function cleanReading(rawReading, word) {
  const str = String(rawReading || word || '').trim();
  if (!str) return '';
  return wanakana.toHiragana(str.replace(/[・\s/(),].*$/, ''));
}

function toRomajiClean(reading) {
  if (!reading) return '';
  return wanakana.toRomaji(reading).toLowerCase().trim();
}

function translateEnListToVi(enList, word, pos) {
  const viSet = new Set();
  for (const raw of enList) {
    const clean = String(raw)
      .toLowerCase()
      .replace(/^to\s+/, '')
      .replace(/\s*\([^)]*\)\s*/g, '')
      .trim();
    if (EN_TO_VI_DICT[clean]) {
      for (const item of EN_TO_VI_DICT[clean].split(',')) {
        if (item.trim()) viSet.add(item.trim().charAt(0).toUpperCase() + item.trim().slice(1));
      }
    }
  }
  if (viSet.size > 0) return Array.from(viSet);

  const hv = computeHanViet(word);
  const firstEn = enList[0] ? String(enList[0]).trim() : word;
  if (hv) {
    return [`${firstEn.charAt(0).toUpperCase() + firstEn.slice(1)} (Hán Việt: ${hv})`];
  }
  if (pos && pos.includes('verb')) {
    return [`Làm / thực hiện (${firstEn})`];
  }
  return [firstEn.charAt(0).toUpperCase() + firstEn.slice(1)];
}

const CUSTOM_EXAMPLES = {
  '約束': { ja: '友達と約束があります。', furigana: 'ともだちとやくそくがあります。', vi: 'Tôi có cuộc hẹn với bạn.', en: 'I have an appointment with a friend.' },
  '私': { ja: '私はベトナム人です。', furigana: 'わたしはべとなむじんです。', vi: 'Tôi là người Việt Nam.', en: 'I am Vietnamese.' },
  '猫': { ja: '猫が窓のそばにいます。', furigana: 'ねこがまどのそばにいます。', vi: 'Có một con mèo bên cửa sổ.', en: 'There is a cat by the window.' },
  '犬': { ja: '毎朝、犬と散歩します。', furigana: 'まいあさ、いぬとさんぽします。', vi: 'Mỗi sáng tôi đi dạo với chó.', en: 'I walk my dog every morning.' },
  '本': { ja: '図書館で本を借りました。', furigana: 'としょかんでほんをかりました。', vi: 'Tôi đã mượn sách ở thư viện.', en: 'I borrowed a book from the library.' },
  'お茶': { ja: '一緒にお茶を飲みませんか。', furigana: 'いっしょにおちゃをのみませんか。', vi: 'Bạn uống trà cùng tôi nhé?', en: 'Would you like to have tea together?' },
  '水': { ja: '水を飲んでください。', furigana: 'みずをのんでください。', vi: 'Hãy uống nước nhé.', en: 'Please drink some water.' },
  '学校': { ja: '学校まで歩いて行きます。', furigana: 'がっこうまであるいていきます。', vi: 'Tôi đi bộ đến trường.', en: 'I walk to school.' },
  '先生': { ja: '田中さんは先生です。', furigana: 'たなかさんはせんせいです。', vi: 'Anh/chị Tanaka là giáo viên.', en: 'Tanaka is a teacher.' },
  '学生': { ja: '私は大学生です。', furigana: 'わたしはだいがくせいです。', vi: 'Tôi là sinh viên đại học.', en: 'I am a university student.' },
  '友達': { ja: '週末、友達と映画を見ます。', furigana: 'しゅうまつ、ともだちとえいがをみます。', vi: 'Cuối tuần tôi xem phim với bạn.', en: 'I watch a movie with my friend on the weekend.' },
  '日本語': { ja: '毎日、日本語を勉強しています。', furigana: 'まいにち、にほんごをべんきょうしています。', vi: 'Tôi đang học tiếng Nhật mỗi ngày.', en: 'I study Japanese every day.' }
};

function buildExampleForVocab(word, reading, pos, viList, enList) {
  if (CUSTOM_EXAMPLES[word]) {
    return [CUSTOM_EXAMPLES[word]];
  }
  const vi = viList[0] || enList[0] || word;
  const en = enList[0] || viList[0] || word;
  const posArr = Array.isArray(pos) ? pos : [String(pos || 'noun')];
  const isVerb = posArr.some(p => p.includes('verb') && !p.includes('suru-verb') && !p.includes('adverb'));
  const isSuru = posArr.some(p => p.includes('suru')) && !word.endsWith('する');
  const isIAdj = posArr.some(p => p.includes('i-adj')) || (word.endsWith('い') && posArr.some(p => p.includes('adj')));
  const isNaAdj = posArr.some(p => p.includes('na-adj'));
  const isAdv = posArr.some(p => p.includes('adverb') || p.includes('conjunction') || p.includes('expression') || p.includes('pronoun'));

  if (isSuru) {
    return [
      {
        ja: `毎日、${word}します。`,
        furigana: `まいにち、${reading}します。`,
        vi: `Mỗi ngày tôi đều ${vi.toLowerCase()}.`,
        en: `I ${en.replace(/^to\s+/i, '').toLowerCase()} every day.`
      }
    ];
  }

  if (isVerb) {
    return [
      {
        ja: `今から${word}つもりです。`,
        furigana: `いまから${reading}つもりです。`,
        vi: `Bây giờ tôi dự định sẽ ${vi.toLowerCase()}.`,
        en: `I plan to ${en.replace(/^to\s+/i, '').toLowerCase()} from now.`
      }
    ];
  }

  if (isIAdj || isNaAdj) {
    return [
      {
        ja: `とても${word}ですね。`,
        furigana: `とても${reading}ですね。`,
        vi: `Thật là ${vi.toLowerCase()} nhỉ.`,
        en: `It is very ${en.toLowerCase()}, isn't it?`
      }
    ];
  }

  if (isAdv) {
    return [
      {
        ja: `会話で「${word}」をよく使います。`,
        furigana: `かいわで「${reading}」をよくつかいます。`,
        vi: `Trong hội thoại thường dùng từ "${word}" (${vi.toLowerCase()}).`,
        en: `We often use "${word}" (${en.toLowerCase()}) in conversation.`
      }
    ];
  }

  return [
    {
      ja: `日本語で「${word}」と言います。`,
      furigana: `にほんごで「${reading}」といいます。`,
      vi: `Trong tiếng Nhật gọi "${vi.toLowerCase()}" là ${word}.`,
      en: `In Japanese, "${en.toLowerCase()}" is called ${word}.`
    }
  ];
}

// Generate structured compound & inflectional JLPT N5-N4 vocabulary items so the dataset is rich and comprehensive
function generateStructuredJlptCompounds() {
  const generated = [];

  // Days of the month & counters (N5)
  const dayNames = [
    ['十一日', 'じゅういちにち', 'Ngày 11', 'eleventh day of the month'],
    ['十二日', 'じゅうににち', 'Ngày 12', 'twelfth day of the month'],
    ['十三日', 'じゅうさんにち', 'Ngày 13', 'thirteenth day of the month'],
    ['十五日', 'じゅうごにち', 'Ngày 15', 'fifteenth day of the month'],
    ['十六日', 'じゅうろくにち', 'Ngày 16', 'sixteenth day of the month'],
    ['十七日', 'じゅうしちにち', 'Ngày 17', 'seventeenth day of the month'],
    ['十八日', 'じゅうはちにち', 'Ngày 18', 'eighteenth day of the month'],
    ['十九日', 'じゅうくにち', 'Ngày 19', 'nineteenth day of the month'],
    ['二十一日', 'にじゅういちにち', 'Ngày 21', 'twenty-first day of the month'],
    ['二十二日', 'にじゅうににち', 'Ngày 22', 'twenty-second day of the month'],
    ['二十三日', 'にじゅうさんにち', 'Ngày 23', 'twenty-third day of the month'],
    ['二十五日', 'にじゅうごにち', 'Ngày 25', 'twenty-fifth day of the month'],
    ['二十六日', 'にじゅうろくにち', 'Ngày 26', 'twenty-sixth day of the month'],
    ['二十七日', 'にじゅうしちにち', 'Ngày 27', 'twenty-seventh day of the month'],
    ['二十八日', 'にじゅうはちにち', 'Ngày 28', 'twenty-eighth day of the month'],
    ['二十九日', 'にじゅうくにち', 'Ngày 29', 'twenty-ninth day of the month'],
    ['三十日', 'さんじゅうにち', 'Ngày 30', 'thirtieth day of the month'],
    ['三十一日', 'さんじゅういちにち', 'Ngày 31', 'thirty-first day of the month'],
    ['何日', 'なんにち', 'Ngày mấy, bao nhiêu ngày', 'what day; how many days'],
    ['何月', 'なんがつ', 'Tháng mấy', 'what month'],
    ['何年', 'なんねん', 'Năm nào, mấy năm', 'what year; how many years'],
    ['何人', 'なんにん', 'Mấy người', 'how many people'],
    ['五人', 'ごにん', 'Năm người', 'five people'],
    ['六人', 'ろくにん', 'Sáu người', 'six people'],
    ['七人', 'しちにん', 'Bảy người', 'seven people'],
    ['八人', 'はちにん', 'Tám người', 'eight people'],
    ['九人', 'きゅうにん', 'Chín người', 'nine people'],
    ['十人', 'じゅうにん', 'Mười người', 'ten people'],
    ['二百', 'にひゃく', 'Hai trăm (200)', 'two hundred'],
    ['三百', 'さんびゃく', 'Ba trăm (300)', 'three hundred'],
    ['四百', 'よんひゃく', 'Bốn trăm (400)', 'four hundred'],
    ['五百', 'ごひゃく', 'Năm trăm (500)', 'five hundred'],
    ['六百', 'ろっぴゃく', 'Sáu trăm (600)', 'six hundred'],
    ['七百', 'ななひゃく', 'Bảy trăm (700)', 'seven hundred'],
    ['八百', 'はっぴゃく', 'Tám trăm (800)', 'eight hundred'],
    ['九百', 'きゅうひゃく', 'Chín trăm (900)', 'nine hundred'],
    ['二千', 'にせん', 'Hai nghìn (2000)', 'two thousand'],
    ['三千', 'さんぜん', 'Ba nghìn (3000)', 'three thousand'],
    ['四千', 'よんせん', 'Bốn nghìn (4000)', 'four thousand'],
    ['五千', 'ごせん', 'Năm nghìn (5000)', 'five thousand'],
    ['八千', 'はっせん', 'Tám nghìn (8000)', 'eight thousand'],
    ['一万', 'いちまん', 'Mười nghìn (10.000)', 'ten thousand'],
    ['十万', 'じゅうまん', 'Một trăm nghìn (100.000)', 'one hundred thousand'],
    ['百万', 'ひゃくまん', 'Một triệu (1.000.000)', 'one million'],
    ['二時間', 'にじかん', 'Hai tiếng đồng hồ', 'two hours'],
    ['三時間', 'さんじかん', 'Ba tiếng đồng hồ', 'three hours'],
    ['四時間', 'よじかん', 'Bốn tiếng đồng hồ', 'four hours'],
    ['二週間', 'にしゅうかん', 'Hai tuần lễ', 'two weeks'],
    ['三週間', 'さんしゅうかん', 'Ba tuần lễ', 'three weeks'],
    ['二ヶ月', 'にかげつ', 'Hai tháng', 'two months'],
    ['三ヶ月', 'さんかげつ', 'Ba tháng', 'three months'],
    ['六ヶ月', 'ろっかげつ', 'Sáu tháng', 'six months'],
    ['半年', 'はんとし', 'Nửa năm', 'half a year'],
    ['二年', 'にねん', 'Hai năm', 'two years'],
    ['三年', 'さんねん', 'Ba năm', 'three years']
  ];

  for (const [word, reading, vi, en] of dayNames) {
    generated.push({ word, reading, jlpt: 'N5', pos: ['noun'], vi: [vi], en: [en] });
  }

  // Country & Language pairs common in N5/N4
  const countries = [
    ['ベトナム', 'ベトナム', 'Việt Nam', 'Vietnam'],
    ['ベトナム語', 'ベトナムご', 'Tiếng Việt', 'Vietnamese language'],
    ['ベトナム人', 'ベトナムじん', 'Người Việt Nam', 'Vietnamese person'],
    ['アメリカ', 'アメリカ', 'Nước Mỹ (Hoa Kỳ)', 'America; USA'],
    ['イギリス', 'イギリス', 'Nước Anh', 'United Kingdom; Britain'],
    ['フランス', 'フランス', 'Nước Pháp', 'France'],
    ['フランス語', 'フランスご', 'Tiếng Pháp', 'French language'],
    ['ドイツ', 'ドイツ', 'Nước Đức', 'Germany'],
    ['ドイツ語', 'ドイツご', 'Tiếng Đức', 'German language'],
    ['中国', 'ちゅうごく', 'Trung Quốc', 'China'],
    ['中国語', 'ちゅうごくご', 'Tiếng Trung Quốc', 'Chinese language'],
    ['韓国', 'かんこく', 'Hàn Quốc', 'South Korea'],
    ['韓国語', 'かんこくご', 'Tiếng Hàn Quốc', 'Korean language'],
    ['オーストラリア', 'オーストラリア', 'Nước Úc (Australia)', 'Australia'],
    ['アジア', 'アジア', 'Châu Á', 'Asia'],
    ['ヨーロッパ', 'ヨーロッパ', 'Châu Âu', 'Europe'],
    ['アフリカ', 'アフリカ', 'Châu Phi', 'Africa'],
    ['京都', 'きょうと', 'Cố đô Kyoto', 'Kyoto'],
    ['大阪', 'おおさか', 'Thành phố Osaka', 'Osaka'],
    ['北海道', 'ほっかいどう', 'Đảo Hokkaido', 'Hokkaido'],
    ['沖縄', 'おきなわ', 'Tỉnh Okinawa', 'Okinawa'],
    ['富士山', 'ふじさん', 'Núi Phú Sĩ', 'Mount Fuji']
  ];

  for (const [word, reading, vi, en] of countries) {
    generated.push({ word, reading, jlpt: 'N5', pos: ['noun'], vi: [vi], en: [en] });
  }

  return generated;
}

async function buildVocabDataset() {
  const [upN5, upN4] = await Promise.all([
    fetchJsonWithFallback(UPSTREAM_URLS.vocabN5, 'JLPT N5 Vocab'),
    fetchJsonWithFallback(UPSTREAM_URLS.vocabN4, 'JLPT N4 Vocab')
  ]);

  const curatedRows = [
    ...parseCuratedVocabRows(),
    ...parseExtendedVocabRows(),
    ...parseSupplementVocabRows(),
    ...generateStructuredJlptCompounds()
  ];

  // Lookup map by word for curated Vietnamese enrichment
  const curatedByWord = new Map();
  for (const item of curatedRows) {
    if (!curatedByWord.has(item.word)) {
      curatedByWord.set(item.word, item);
    }
  }

  const finalVocab = [];
  const seenKey = new Set();

  // 1. Add priority items first (e.g. 約束 as v_n4_0001)
  for (const p of PRIORITY_VOCAB) {
    seenKey.add(`${p.word}::${p.reading}`);
    finalVocab.push(p);
  }

  // 2. Add all curated bilingual N5/N4 items
  for (const item of curatedRows) {
    const reading = cleanReading(item.reading, item.word);
    const key = `${item.word}::${reading}`;
    if (seenKey.has(key)) continue;
    seenKey.add(key);

    const romaji = toRomajiClean(reading);
    const hanViet = computeHanViet(item.word);
    const jlpt = item.jlpt === 'N4' ? 'N4' : 'N5';
    finalVocab.push({
      id: '', // Assigned sequentially below
      word: item.word,
      reading,
      romaji,
      hanViet,
      jlpt,
      pos: item.pos,
      meanings: {
        vi: item.vi,
        en: item.en
      },
      examples: buildExampleForVocab(item.word, reading, item.pos, item.vi, item.en)
    });
  }

  // 3. Merge upstream fetched items (OpenJLPT / Bluskyo)
  const upstreamBatches = [
    { list: Array.isArray(upN5) ? upN5 : (upN5?.words || upN5?.data || []), level: 'N5' },
    { list: Array.isArray(upN4) ? upN4 : (upN4?.words || upN4?.data || []), level: 'N4' }
  ];

  for (const batch of upstreamBatches) {
    for (const raw of batch.list) {
      if (!raw || typeof raw !== 'object') continue;
      const word = String(raw.word || raw.kanji || raw.expression || raw.ja || raw.term || '').trim();
      const rawRead = String(raw.reading || raw.kana || raw.hiragana || raw.furigana || word).trim();
      if (!word) continue;

      const reading = cleanReading(rawRead, word);
      const key = `${word}::${reading}`;
      if (seenKey.has(key)) continue;
      seenKey.add(key);

      const curated = curatedByWord.get(word);
      const rawEn = raw.meanings?.en || raw.meaning || raw.english || raw.gloss || raw.definitions || [];
      const enList = Array.isArray(rawEn)
        ? rawEn.map(s => String(s).trim()).filter(Boolean)
        : String(rawEn)
            .split(/[;,/]/)
            .map(s => s.trim())
            .filter(Boolean);

      if (enList.length === 0 && !curated) continue;

      const posRaw = raw.pos || raw.partOfSpeech || raw.type || curated?.pos || ['noun'];
      const pos = Array.isArray(posRaw)
        ? posRaw.map(s => String(s).trim()).filter(Boolean)
        : String(posRaw)
            .split(/[,;/]/)
            .map(s => s.trim())
            .filter(Boolean);

      const viList = curated?.vi || translateEnListToVi(enList, word, pos);
      const finalEn = enList.length > 0 ? enList : curated.en;
      const romaji = toRomajiClean(reading);
      const hanViet = computeHanViet(word);

      finalVocab.push({
        id: '',
        word,
        reading,
        romaji,
        hanViet,
        jlpt: batch.level,
        pos: pos.length ? pos : ['noun'],
        meanings: {
          vi: viList,
          en: finalEn
        },
        examples: buildExampleForVocab(word, reading, pos, viList, finalEn)
      });
    }
  }

  // Assign deterministic IDs: keep v_n4_0001 for 約束, and sequential IDs per level
  let n5Count = 0;
  let n4Count = 1; // v_n4_0001 is 約束
  for (const entry of finalVocab) {
    if (entry.id) continue;
    if (entry.jlpt === 'N5') {
      n5Count++;
      entry.id = `v_n5_${String(n5Count).padStart(4, '0')}`;
    } else {
      n4Count++;
      entry.id = `v_n4_${String(n4Count).padStart(4, '0')}`;
    }
  }

  return finalVocab;
}

async function buildKanjiDataset() {
  const [upKanjiN5, upKanjiN4, upJouyou] = await Promise.all([
    fetchJsonWithFallback(UPSTREAM_URLS.kanjiN5, 'JLPT N5 Kanji'),
    fetchJsonWithFallback(UPSTREAM_URLS.kanjiN4, 'JLPT N4 Kanji'),
    fetchJsonWithFallback(UPSTREAM_URLS.kanjiJouyou, 'Jouyou Kanji Data')
  ]);

  const byChar = new Map();
  for (const k of CURATED_KANJI) {
    byChar.set(k.character, { ...k });
  }

  // Enrich from davidluzgouveia/kanji-data if available (object keyed by kanji character)
  if (upJouyou && typeof upJouyou === 'object' && !Array.isArray(upJouyou)) {
    for (const [char, details] of Object.entries(upJouyou)) {
      if (!details || typeof details !== 'object') continue;
      const jlptNew = details.jlpt_new;
      if (jlptNew !== 5 && jlptNew !== 4 && !byChar.has(char)) continue;

      const existing = byChar.get(char);
      const level = existing?.jlpt || (jlptNew === 5 ? 'N5' : 'N4');
      const strokes = Number(details.strokes) || existing?.strokes || 1;
      const onyomi = Array.isArray(details.readings_on) && details.readings_on.length
        ? details.readings_on
        : existing?.onyomi || [];
      const kunyomi = Array.isArray(details.readings_kun) && details.readings_kun.length
        ? details.readings_kun
        : existing?.kunyomi || [];
      const enMeanings = Array.isArray(details.meanings) && details.meanings.length
        ? details.meanings
        : existing?.meanings.en || [];
      const hanViet = existing?.hanViet || HAN_VIET_MAP[char] || 'HÁN TỰ';
      const viMeanings = existing?.meanings.vi || translateEnListToVi(enMeanings, char, ['noun']);

      byChar.set(char, {
        character: char,
        hanViet,
        jlpt: level,
        strokes,
        radical: existing?.radical || details.radical || char,
        onyomi,
        kunyomi,
        meanings: {
          vi: viMeanings,
          en: enMeanings
        },
        examples: existing?.examples || [char]
      });
    }
  }

  // Also merge OpenJLPT kanji N5 & N4 if returned
  const upstreamKanjiBatches = [
    { data: upKanjiN5, level: 'N5' },
    { data: upKanjiN4, level: 'N4' }
  ];
  for (const batch of upstreamKanjiBatches) {
    const list = Array.isArray(batch.data) ? batch.data : (batch.data?.kanji || batch.data?.data || []);
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const char = String(item.character || item.kanji || item.literal || '').trim();
      if (!char || byChar.has(char)) continue;
      const en = Array.isArray(item.meanings) ? item.meanings : String(item.meaning || '').split(',').map(s => s.trim()).filter(Boolean);
      const hanViet = HAN_VIET_MAP[char] || 'HÁN TỰ';
      byChar.set(char, {
        character: char,
        hanViet,
        jlpt: batch.level,
        strokes: Number(item.strokes || item.stroke_count) || 6,
        radical: String(item.radical || char),
        onyomi: Array.isArray(item.onyomi) ? item.onyomi : [],
        kunyomi: Array.isArray(item.kunyomi) ? item.kunyomi : [],
        meanings: {
          vi: translateEnListToVi(en, char, ['noun']),
          en: en.length ? en : [char]
        },
        examples: Array.isArray(item.examples) ? item.examples : [char]
      });
    }
  }

  return Array.from(byChar.values());
}

async function buildGrammarDataset() {
  const [upGrammarN5, upGrammarN4, upGrammarFallback] = await Promise.all([
    fetchJsonWithFallback(UPSTREAM_URLS.grammarN5, 'JLPT N5 Grammar'),
    fetchJsonWithFallback(UPSTREAM_URLS.grammarN4, 'JLPT N4 Grammar'),
    fetchJsonWithFallback(UPSTREAM_URLS.grammarFallback, 'JLPT Grammar Fallback List')
  ]);

  const finalGrammar = [...CURATED_GRAMMAR];
  const seenTitles = new Set(finalGrammar.map(g => g.title.replace(/^[〜～~]/, '').trim()));

  const extraCandidates = [];
  if (Array.isArray(upGrammarN5)) extraCandidates.push(...upGrammarN5.map(x => ({ ...x, jlpt: 'N5' })));
  if (Array.isArray(upGrammarN4)) extraCandidates.push(...upGrammarN4.map(x => ({ ...x, jlpt: 'N4' })));
  if (Array.isArray(upGrammarFallback)) {
    for (const item of upGrammarFallback) {
      const lvl = String(item?.level || item?.jlpt || '').toUpperCase();
      if (lvl === 'N5' || lvl === 'N4') {
        extraCandidates.push({ ...item, jlpt: lvl });
      }
    }
  }

  let n5Idx = finalGrammar.filter(g => g.jlpt === 'N5').length;
  let n4Idx = finalGrammar.filter(g => g.jlpt === 'N4').length;

  for (const raw of extraCandidates) {
    const rawTitle = String(raw.title || raw.grammar || raw.pattern || '').trim();
    if (!rawTitle) continue;
    const cleanTitle = rawTitle.replace(/^[〜～~]/, '').trim();
    if (seenTitles.has(cleanTitle)) continue;
    seenTitles.add(cleanTitle);

    const reading = wanakana.toHiragana(String(raw.reading || raw.kana || cleanTitle));
    const romaji = String(raw.romaji || toRomajiClean(reading));
    const enMeaning = String(raw.meaning?.en || raw.meaning || raw.english || cleanTitle).trim();
    const viMeaning = String(raw.meaning?.vi || `Cấu trúc ngữ pháp ${rawTitle} (${enMeaning})`).trim();
    const jlpt = raw.jlpt === 'N5' ? 'N5' : 'N4';
    const id = jlpt === 'N5'
      ? `g_n5_${String(++n5Idx).padStart(3, '0')}`
      : `g_n4_${String(++n4Idx).padStart(3, '0')}`;

    finalGrammar.push({
      id,
      title: rawTitle.startsWith('〜') ? rawTitle : `〜${rawTitle}`,
      reading,
      romaji,
      jlpt,
      meaning: {
        vi: viMeaning,
        en: enMeaning
      },
      formation: Array.isArray(raw.formation) ? raw.formation : [String(raw.formation || `Động từ / Danh từ + ${cleanTitle}`)],
      explanation: String(raw.explanation || `Mẫu ngữ pháp ${jlpt} biểu thị ý nghĩa: ${viMeaning}.`),
      notes: String(raw.notes || `Thường gặp trong bài thi JLPT ${jlpt} và hội thoại hằng ngày.`),
      examples: Array.isArray(raw.examples) && raw.examples.length > 0
        ? raw.examples.map(ex => ({
            ja: String(ex.ja || ex.japanese || `${cleanTitle}`),
            furigana: String(ex.furigana || ex.reading || ex.ja || ''),
            vi: String(ex.vi || ex.vietnamese || viMeaning),
            en: String(ex.en || ex.english || enMeaning)
          }))
        : [
            {
              ja: `この文では「${cleanTitle}」を使います。`,
              furigana: `このぶんでは「${reading}」をつかいます。`,
              vi: `Trong câu này chúng ta sử dụng cấu trúc "${cleanTitle}".`,
              en: `In this sentence we use "${cleanTitle}" (${enMeaning}).`
            }
          ]
    });
  }

  return finalGrammar;
}

async function main() {
  console.log('====================================================');
  console.log(' Starting JLPT N5-N4 Complete Database Seeding');
  console.log('====================================================');

  await fs.mkdir(DATA_DIR, { recursive: true });

  const [vocab, kanji, grammar] = await Promise.all([
    buildVocabDataset(),
    buildKanjiDataset(),
    buildGrammarDataset()
  ]);

  // Verify minimum counts required by specification
  if (vocab.length < 1200) {
    throw new Error(`Vocabulary count (${vocab.length}) is below required minimum of 1,200!`);
  }
  if (kanji.length < 250) {
    throw new Error(`Kanji count (${kanji.length}) is below required minimum of 250!`);
  }
  if (grammar.length < 115) {
    throw new Error(`Grammar count (${grammar.length}) is below required minimum of 115!`);
  }

  const vocabPath = path.join(DATA_DIR, 'jlpt_vocab_n5_n4.json');
  const kanjiPath = path.join(DATA_DIR, 'jlpt_kanji_n5_n4.json');
  const grammarPath = path.join(DATA_DIR, 'jlpt_grammar_n5_n4.json');

  await Promise.all([
    fs.writeFile(vocabPath, JSON.stringify(vocab, null, 2) + '\n', 'utf8'),
    fs.writeFile(kanjiPath, JSON.stringify(kanji, null, 2) + '\n', 'utf8'),
    fs.writeFile(grammarPath, JSON.stringify(grammar, null, 2) + '\n', 'utf8')
  ]);

  const n5Vocab = vocab.filter(v => v.jlpt === 'N5').length;
  const n4Vocab = vocab.filter(v => v.jlpt === 'N4').length;
  const n5Kanji = kanji.filter(k => k.jlpt === 'N5').length;
  const n4Kanji = kanji.filter(k => k.jlpt === 'N4').length;
  const n5Grammar = grammar.filter(g => g.jlpt === 'N5').length;
  const n4Grammar = grammar.filter(g => g.jlpt === 'N4').length;

  console.log(`[seed] Wrote ${vocab.length} vocabulary entries (N5: ${n5Vocab}, N4: ${n4Vocab}) -> src/data/jlpt_vocab_n5_n4.json`);
  console.log(`[seed] Wrote ${kanji.length} Kanji entries (N5: ${n5Kanji}, N4: ${n4Kanji}) -> src/data/jlpt_kanji_n5_n4.json`);
  console.log(`[seed] Wrote ${grammar.length} Grammar entries (N5: ${n5Grammar}, N4: ${n4Grammar}) -> src/data/jlpt_grammar_n5_n4.json`);
  console.log('====================================================');
  console.log(' Seed completed and verified successfully!');
  console.log('====================================================');
}

main().catch(err => {
  console.error('[seed] Fatal error:', err);
  process.exit(1);
});
