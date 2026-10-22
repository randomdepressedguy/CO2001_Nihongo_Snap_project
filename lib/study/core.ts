export type Lang = 'vi' | 'en';
export type Word = {
    id: string;
    jp: string;
    kana: string;
    romaji: string;
    vi: string;
    en: string;
    tag: string;
    level: string;
    example: string;
    exampleVi: string;
    exampleEn: string;
};
export type Card = Word & {
    deck: string;
    favorite: boolean;
    note: string;
    image?: string;
    due: number;
    interval: number;
    ease: number;
    reps: number;
    lapses: number;
    created: number;
};
export type Settings = {
    name: string;
    lang: Lang;
    level: string;
    goal: number;
    romaji: boolean;
    furigana: boolean;
    onboarded: boolean;
};
export type Activity = {
    reviews: number;
    correct: number;
    seconds: number;
    lessons: string[];
};
export type State = {
    version: 2;
    settings: Settings;
    cards: Card[];
    decks: string[];
    activity: Record<string, Activity>;
    completed: string[];
    answers: Record<string, Record<string, string>>;
    chat: {
        role: 'user' | 'model';
        text: string;
    }[];
};
export const defaultState = (): State => ({ version: 2, settings: { name: '', lang: 'vi', level: 'N5', goal: 10, romaji: true, furigana: true, onboarded: false }, cards: [], decks: ['My words'], activity: {}, completed: [], answers: {}, chat: [] });
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function streak(activity: State['activity'], now = new Date()) { let n = 0; const day = new Date(now); if (!activity[localDate(day)])
    day.setDate(day.getDate() - 1); while (activity[localDate(day)]) {
    n++;
    day.setDate(day.getDate() - 1);
} return n; }
export function makeCard(w: Word, deck = 'My words'): Card { return { ...w, id: newId(), deck, favorite: false, note: '', due: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0, created: Date.now() }; }
export function schedule(c: Card, grade: number, now = Date.now()): Card { const x = { ...c }; if (grade === 0) {
    x.interval = 0;
    x.reps = 0;
    x.lapses++;
    x.ease = Math.max(1.3, x.ease - .2);
    x.due = now + 60000;
}
else {
    const factor = grade === 1 ? 1.2 : grade === 3 ? x.ease * 1.3 : x.ease;
    x.interval = x.reps === 0 ? (grade === 1 ? 1 : grade === 3 ? 4 : 1) : x.reps === 1 ? (grade === 1 ? 2 : grade === 3 ? 8 : 3) : Math.max(x.interval + 1, Math.round(x.interval * factor));
    x.reps++;
    x.ease = Math.max(1.3, Math.min(3.2, x.ease + (grade === 1 ? -.15 : grade === 3 ? .15 : 0)));
    x.due = now + x.interval * 86400000;
} return x; }
export function record(s: State, seconds = 0, review?: boolean, lesson?: string): State { const key = localDate(); const a = s.activity[key] ?? { reviews: 0, correct: 0, seconds: 0, lessons: [] }; return { ...s, activity: { ...s.activity, [key]: { reviews: a.reviews + (review === undefined ? 0 : 1), correct: a.correct + (review ? 1 : 0), seconds: a.seconds + Math.max(0, Math.min(300, seconds)), lessons: lesson ? [...new Set([...a.lessons, lesson])] : a.lessons } } }; }
export function normalize(s: string) { return s.normalize('NFKC').trim().toLowerCase().replace(/đ/g, 'd').replace(/[\s。、！？.!?]/g, '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 96)); }
export function matches(answer: string, w: Pick<Word, 'jp' | 'kana' | 'romaji'>) { return [w.jp, w.kana, w.romaji].some(x => normalize(x) === normalize(answer)); }
export function searchWords<T extends Word>(words: T[], query: string) { const q = normalize(query).normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return words.filter(w => [w.jp, w.kana, w.romaji, w.vi, w.en, w.tag].some(x => normalize(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q))); }
const short = (v: unknown, n = 500) => typeof v === 'string' ? v.slice(0, n) : '';
export function validateWord(input: unknown): Word { if (!input || typeof input !== 'object')
    throw Error('Invalid vocabulary entry'); const x = input as Record<string, unknown>; const jp = short(x.jp ?? x.japanese ?? x.kanji, 100).trim(); const kana = short(x.kana, 100).trim(); if (!jp || !kana)
    throw Error('Each word needs Japanese and kana'); return { id: short(x.id, 100) || newId(), jp, kana, romaji: short(x.romaji, 100), vi: short(x.vi ?? x.vietnamese, 300), en: short(x.en ?? x.label, 300), tag: short(x.tag, 60) || 'custom', level: short(x.level, 10) || '—', example: short(x.example), exampleVi: short(x.exampleVi), exampleEn: short(x.exampleEn) }; }
export function validateState(input: unknown): State { if (!input || typeof input !== 'object')
    throw Error('Invalid backup'); const x = input as Record<string, unknown>; if (x.version !== 2 || !Array.isArray(x.cards) || x.cards.length > 5000)
    throw Error('Unsupported backup format (version 2 required)'); const s = defaultState(); const p = (x.settings ?? {}) as Record<string, unknown>; s.settings = { name: short(p.name, 40), lang: p.lang === 'en' ? 'en' : 'vi', level: ['N5', 'N4', 'N3', 'N2', 'N1'].includes(String(p.level)) ? String(p.level) : 'N5', goal: [5, 10, 20].includes(Number(p.goal)) ? Number(p.goal) : 10, romaji: p.romaji !== false, furigana: p.furigana !== false, onboarded: !!p.onboarded }; s.decks = Array.isArray(x.decks) ? [...new Set(x.decks.filter(d => typeof d === 'string' && d.trim()).map(d => String(d).slice(0, 60)))].slice(0, 100) : s.decks; if (!s.decks.length)
    s.decks = ['My words']; const num = (n: unknown, f: number, min = 0, max = 1e15) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max ? n : f; s.cards = x.cards.map((v: unknown) => { const r = v as Record<string, unknown>; const w = validateWord(r); return { ...makeCard(w), ...w, deck: s.decks.includes(String(r.deck)) ? String(r.deck) : s.decks[0], favorite: !!r.favorite, note: short(r.note, 2000), image: typeof r.image === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(r.image) && r.image.length < 100000 ? r.image : undefined, due: num(r.due, Date.now()), interval: num(r.interval, 0, 0, 36500), ease: num(r.ease, 2.5, 1.3, 3.2), reps: num(r.reps, 0, 0, 100000), lapses: num(r.lapses, 0, 0, 100000), created: num(r.created, Date.now()) }; }); const ids = new Set<string>(); s.cards = s.cards.map(c => { if (ids.has(c.id))
    c.id = newId(); ids.add(c.id); return c; }); s.completed = Array.isArray(x.completed) ? x.completed.filter(a => typeof a === 'string').slice(0, 500) : []; if (x.activity && typeof x.activity === 'object')
    for (const [key, v] of Object.entries(x.activity)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !v || typeof v !== 'object')
            continue;
        const a = v as Record<string, unknown>;
        s.activity[key] = { reviews: num(a.reviews, 0, 0, 100000), correct: num(a.correct, 0, 0, 100000), seconds: num(a.seconds, 0, 0, 86400), lessons: Array.isArray(a.lessons) ? a.lessons.filter(i => typeof i === 'string').slice(0, 100) : [] };
    } if (x.answers && typeof x.answers === 'object')
    for (const [lesson, values] of Object.entries(x.answers)) {
        if (values && typeof values === 'object')
            s.answers[lesson] = Object.fromEntries(Object.entries(values).filter(([k, v]) => /^q\d+$/.test(k) && typeof v === 'string').map(([k, v]) => [k, String(v).slice(0, 300)]));
    } s.chat = Array.isArray(x.chat) ? x.chat.filter(m => m && typeof m === 'object' && ['user', 'model'].includes(m.role) && typeof m.text === 'string').slice(-40).map(m => ({ role: m.role, text: m.text.slice(0, 6000) })) : []; return s; }
export function mergeWords(s: State, words: Word[], deck: string) { const cards = [...s.cards]; for (const w of words)
    if (!cards.some(c => c.deck === deck && normalize(c.jp) === normalize(w.jp) && normalize(c.kana) === normalize(w.kana)))
        cards.push(makeCard(w, deck)); return { ...s, cards }; }
// UUIDs also work on local HTTP previews where randomUUID is unavailable.
export function newId(): string {
    if (typeof crypto.randomUUID === 'function')
        return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, n => n.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
