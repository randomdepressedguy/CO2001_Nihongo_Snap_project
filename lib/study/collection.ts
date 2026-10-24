import { type Card, type State, type Word, makeCard, normalize, validateState, validateWord, newId } from './core.ts';
export function sameWord(a: Word, b: Word) {
    return normalize(a.jp) === normalize(b.jp) && normalize(a.kana) === normalize(b.kana);
}
export function importCollection(state: State, raw: unknown, deck = state.decks[0]) {
    const incoming = raw as {
        version?: number;
        results?: unknown[];
    };
    let candidates: Card[];
    let decks = [...state.decks];
    if (incoming?.version === 2) {
        const clean = validateState(raw);
        candidates = clean.cards;
        decks = [...new Set([...decks, ...clean.decks])];
    }
    else {
        const list = Array.isArray(raw) ? raw : incoming?.results;
        if (!Array.isArray(list) || list.length > 5000)
            throw Error('INVALID_IMPORT');
        candidates = list.map(word => makeCard(validateWord(word), deck));
    }
    const cards = [...state.cards];
    for (const c of candidates) {
        if (!cards.some(existing => existing.deck === c.deck && sameWord(existing, c))) {
            cards.push({ ...c, id: newId() });
        }
    }
    if (cards.length > 5000 || decks.length > 100)
        throw Error('COLLECTION_LIMIT');
    return { ...state, cards, decks };
}
export function dueCards(cards: Card[], now = Date.now()) {
    return cards.filter(c => c.due <= now).sort((a, b) => a.due - b.due || a.created - b.created);
}
export const topicNames: Record<string, [
    string,
    string
]> = {
    N4: ['Thêm một bước · N4', 'A step further · N4'],
    travel: ['Đi lại', 'Travel'], weather: ['Thời tiết', 'Weather'],
    animals: ['Động vật', 'Animals'], food: ['Ăn uống', 'Food & drinks'],
    objects: ['Đồ vật', 'Everyday objects'], places: ['Địa điểm', 'Places'],
    people: ['Con người', 'People'], time: ['Thời gian', 'Time'],
    verbs: ['Hoạt động', 'Actions'], adjectives: ['Miêu tả', 'Descriptions'],
    nature: ['Thiên nhiên', 'Nature'], transport: ['Đi lại', 'Transport'],
    greetings: ['Giao tiếp', 'Greetings'], custom: ['Từ của bạn', 'Your words'],
    family: ['Gia đình', 'Family'], study: ['Học tập', 'Study'],
};
export function shuffled<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Removing a deck preserves words, favorites and both notes. Duplicate words
// retain the earlier of their two schedules so a review is never postponed.
export function removeDeck(state: State, deck: string): State {
    const destination = state.decks.find(d => d !== deck);
    if (!destination) throw Error('LAST_DECK');
    const cards = state.cards.filter(c => c.deck !== deck).map(c => ({ ...c }));
    for (const source of state.cards.filter(c => c.deck === deck)) {
        const i = cards.findIndex(c => c.deck === destination && sameWord(c, source));
        if (i < 0) { cards.push({ ...source, deck: destination }); continue; }
        const existing = cards[i];
        const note = [...new Set([existing.note, source.note].filter(Boolean))].join('\n\n');
        if (note.length > 2000) throw Error('NOTE_TOO_LONG');
        const earlier = existing.due <= source.due ? existing : source;
        cards[i] = { ...existing, note, favorite: existing.favorite || source.favorite,
            due: earlier.due, interval: earlier.interval, ease: earlier.ease,
            reps: earlier.reps, lapses: Math.max(existing.lapses, source.lapses) };
    }
    return { ...state, cards, decks: state.decks.filter(d => d !== deck) };
}
