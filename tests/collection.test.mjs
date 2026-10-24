import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, makeCard, newId, schedule, searchWords } from '../lib/study/core.ts';
import { WORDS } from '../lib/study/data.ts';
import { dueCards, importCollection, sameWord } from '../lib/study/collection.ts';
const cat = WORDS.find(w => w.jp === '猫');

test('import merges without resetting an existing schedule, note or favorite', () => {
  const state = defaultState();
  const card = { ...schedule(makeCard(cat), 3, 1700000000000), note: 'My own memory', favorite: true };
  state.cards = [card];
  const copy = structuredClone(state); copy.cards[0].kana = 'ネコ'; copy.cards[0].due = 0;
  const next = importCollection(state, copy);
  assert.equal(next.cards.length, 1);
  assert.deepEqual(next.cards[0], card);
  assert.deepEqual(state.cards[0], card);
});
test('import retains new decks and review schedules from version 2 backup', () => {
  const imported = defaultState(); imported.decks = ['My Japanese'];
  imported.cards = [{ ...makeCard(cat, 'My Japanese'), note: 'Remember me', due: 1700000000000, interval: 4, reps: 1 }];
  const result = importCollection(defaultState(), imported);
  assert.ok(result.decks.includes('My Japanese'));
  assert.equal(result.cards[0].note, 'Remember me');
  assert.equal(result.cards[0].due, 1700000000000);
  assert.notEqual(result.cards[0].id, imported.cards[0].id);
});
test('legacy imports are atomic when one entry is invalid', () => {
  const state = defaultState(); const before = structuredClone(state);
  assert.throws(() => importCollection(state, [cat, { jp: 'invalid' }]));
  assert.deepEqual(state, before);
  assert.throws(() => importCollection(state, null));
});
test('due cards are oldest first and free practice can keep original cards unchanged', () => {
  const cards = [{ ...makeCard(cat), due: 30 }, { ...makeCard(cat), due: 10 }, { ...makeCard(cat), due: 100 }];
  const original = structuredClone(cards);
  assert.deepEqual(dueCards(cards, 50).map(c => c.due), [10, 30]);
  assert.deepEqual(cards, original);
});
test('all dictionary words have authored context and working multilingual search', () => {
  for (const w of WORDS) {
    assert.ok(w.example && w.exampleVi && w.exampleEn, w.jp);
    assert.ok(!w.example.includes('見てください'), w.jp);
  }
  assert.ok(searchWords(WORDS, 'dong ho').some(w => w.jp === '時計'));
  assert.ok(searchWords(WORDS, 'DEKAI').length === 0);
  assert.ok(sameWord(cat, { ...cat, jp: ' 猫 ', kana: 'ネコ' }));
});
test('UUID generation also supports HTTP preview without crypto.randomUUID', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  const source = globalThis.crypto;
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { getRandomValues: source.getRandomValues.bind(source) } });
  try {
    const ids = Array.from({ length: 100 }, () => newId());
    assert.equal(new Set(ids).size, 100);
    assert.ok(ids.every(id => /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/.test(id)));
  } finally { Object.defineProperty(globalThis, 'crypto', original); }
});

test('removing a deck merges duplicate words without losing notes or postponing review', async () => {
  const { removeDeck } = await import('../lib/study/collection.ts');
  const state = defaultState(); state.decks.push('Extra');
  const one = { ...makeCard(cat), due: 200, note: 'First memory' };
  const two = { ...makeCard(cat, 'Extra'), due: 100, note: 'Second memory', favorite: true };
  state.cards = [one, two];
  const clean = removeDeck(state, 'Extra');
  assert.equal(clean.cards.length, 1);
  assert.equal(clean.cards[0].id, one.id);
  assert.equal(clean.cards[0].due, 100);
  assert.equal(clean.cards[0].favorite, true);
  assert.equal(clean.cards[0].note, 'First memory\n\nSecond memory');
  assert.equal(state.cards.length, 2);
  assert.throws(() => removeDeck(defaultState(), 'My words'));
});
