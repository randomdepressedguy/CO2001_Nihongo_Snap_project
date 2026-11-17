'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, CheckSquare, Layers, Loader2, Plus, Sparkles, Square, Volume2 } from 'lucide-react';
import { type OcrRecognitionResult } from '@/lib/study/ocrService';
import {
    type DictionaryLookupResult,
    containsKanji,
    lookupJapaneseWord,
    lookupResultToWord,
} from '@/lib/study/jishoService';
import { localDate, makeCard, normalize } from '@/lib/study/core';
import { useStudy } from './context';

export type SnapToDeckBuilderProps = {
    result: OcrRecognitionResult;
    thumbnail?: string;
    onDeckSaved?: (deckName: string, savedCount: number) => void;
};

type BaseTokenItem = {
    token: string;
    hasKanji: boolean;
    sourceSentence: string;
};

export function SnapToDeckBuilder({ result, thumbnail, onDeckSaved }: SnapToDeckBuilderProps) {
    const { set, t, notify, speak } = useStudy();
    const [deckName, setDeckName] = useState(() => `Snap - ${localDate()}`);
    const [lookupMap, setLookupMap] = useState<Record<string, DictionaryLookupResult | null>>({});
    const [selectionOverride, setSelectionOverride] = useState<{
        resultRef: OcrRecognitionResult | null;
        tokens: Set<string>;
    }>({ resultRef: null, tokens: new Set() });
    const [saving, setSaving] = useState(false);
    const [savedBanner, setSavedBanner] = useState<{
        resultRef: OcrRecognitionResult;
        deck: string;
        count: number;
    } | null>(null);

    const { baseItems, defaultSelected } = useMemo(() => {
        const list: BaseTokenItem[] = result.vocabulary.map(token => {
            const hasK = containsKanji(token);
            const matchingWordBox = result.words.find(w => w.text === token);
            const sentence =
                matchingWordBox?.lineText ||
                result.lines.find(l => l.includes(token)) ||
                result.lines[0] ||
                result.text;
            return {
                token,
                hasKanji: hasK,
                sourceSentence: sentence,
            };
        });
        const kanjiOnes = list.filter(i => i.hasKanji).map(i => i.token);
        const initialSet =
            kanjiOnes.length > 0 ? new Set(kanjiOnes) : new Set(list.map(i => i.token));
        return { baseItems: list, defaultSelected: initialSet };
    }, [result]);

    const selectedTokens =
        selectionOverride.resultRef === result ? selectionOverride.tokens : defaultSelected;

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            for (const entry of baseItems) {
                if (controller.signal.aborted) return;
                try {
                    const res = await lookupJapaneseWord(entry.token, {
                        signal: controller.signal,
                        sourceSentence: entry.sourceSentence,
                    });
                    if (controller.signal.aborted) return;
                    setLookupMap(prev => ({ ...prev, [entry.token]: res }));
                } catch {
                    if (controller.signal.aborted) return;
                    setLookupMap(prev => ({ ...prev, [entry.token]: null }));
                }
            }
        })();

        return () => controller.abort();
    }, [baseItems]);

    if (result.vocabulary.length === 0) {
        return null;
    }

    function updateSelection(nextTokens: Set<string>) {
        setSelectionOverride({ resultRef: result, tokens: nextTokens });
    }

    function toggleToken(token: string) {
        const next = new Set(selectedTokens);
        if (next.has(token)) {
            next.delete(token);
        } else {
            next.add(token);
        }
        updateSelection(next);
    }

    function selectAll() {
        updateSelection(new Set(baseItems.map(i => i.token)));
    }

    function selectKanjiOnly() {
        updateSelection(new Set(baseItems.filter(i => i.hasKanji).map(i => i.token)));
    }

    function clearSelection() {
        updateSelection(new Set());
    }

    async function handleSaveDeck(e: React.FormEvent) {
        e.preventDefault();
        const targetDeck = (deckName.trim() || `Snap - ${localDate()}`).slice(0, 60);
        const chosen = baseItems.filter(i => selectedTokens.has(i.token));
        if (chosen.length === 0) {
            notify(
                t(
                    'Hãy chọn ít nhất 1 từ vựng để tạo bộ thẻ.',
                    'Select at least 1 word to save to the deck.'
                )
            );
            return;
        }

        setSaving(true);
        try {
            const resolvedWords = await Promise.all(
                chosen.map(async item => {
                    const info =
                        lookupMap[item.token] ??
                        (await lookupJapaneseWord(item.token, {
                            sourceSentence: item.sourceSentence,
                        }));
                    return lookupResultToWord(info, item.sourceSentence);
                })
            );

            let addedCount = 0;
            set(state => {
                const nextDecks = state.decks.includes(targetDeck)
                    ? state.decks
                    : [...state.decks, targetDeck];
                const nextCards = [...state.cards];
                for (const word of resolvedWords) {
                    const exists = nextCards.some(
                        c =>
                            c.deck === targetDeck &&
                            normalize(c.jp) === normalize(word.jp) &&
                            normalize(c.kana) === normalize(word.kana)
                    );
                    if (!exists) {
                        nextCards.push({
                            ...makeCard(word, targetDeck),
                            image: thumbnail,
                            note: word.example
                                ? `${t('Trích từ ảnh OCR:', 'From Snap OCR:')} ${word.example}`
                                : '',
                        });
                        addedCount++;
                    }
                }
                return {
                    ...state,
                    decks: nextDecks,
                    cards: nextCards,
                };
            });

            try {
                const existingRaw = localStorage.getItem('nihongo-snap-ocr-decks');
                const parsed: Record<string, unknown[]> = existingRaw ? JSON.parse(existingRaw) : {};
                parsed[targetDeck] = resolvedWords;
                localStorage.setItem('nihongo-snap-ocr-decks', JSON.stringify(parsed));
            } catch {
                // Ignore storage quota errors
            }

            const finalCount = addedCount || resolvedWords.length;
            setSavedBanner({ resultRef: result, deck: targetDeck, count: finalCount });
            notify(
                t(
                    `Đã lưu ${finalCount} từ vào bộ thẻ “${targetDeck}”!`,
                    `Saved ${finalCount} words into deck “${targetDeck}”!`
                )
            );
            onDeckSaved?.(targetDeck, finalCount);
        } finally {
            setSaving(false);
        }
    }

    const activeBanner = savedBanner && savedBanner.resultRef === result ? savedBanner : null;

    return (
        <section
            className="panel snap-to-deck-builder"
            aria-label={t('Tạo bộ thẻ từ ảnh chụp', 'Snap-to-Flashcard Deck Builder')}
        >
            <div className="snap-deck-header">
                <div>
                    <span className="eyebrow">
                        <Sparkles size={13} /> SNAP-TO-FLASHCARD DECK · 一括登録
                    </span>
                    <h2>
                        {t(
                            'Lưu nhanh từ vựng vừa quét thành Bộ thẻ (Deck)',
                            'One-Click Snap-to-Flashcard Deck'
                        )}
                    </h2>
                    <p className="muted">
                        {t(
                            'Các từ chứa chữ Hán (Kanji) đã được chọn sẵn kèm cách đọc Furigana, nghĩa và câu ngữ cảnh gốc.',
                            'Words containing Kanji are pre-selected automatically with Furigana readings, definitions, and source sentence.'
                        )}
                    </p>
                </div>
                <div className="snap-deck-quick-select">
                    <button type="button" className="btn secondary compact" onClick={selectKanjiOnly}>
                        <CheckSquare size={15} />
                        <span>{t('Chỉ chọn từ Kanji', 'Kanji words only')}</span>
                    </button>
                    <button type="button" className="btn secondary compact" onClick={selectAll}>
                        <span>{t('Chọn tất cả', 'Select all')}</span>
                    </button>
                    <button type="button" className="text-btn" onClick={clearSelection}>
                        {t('Bỏ chọn', 'Clear')}
                    </button>
                </div>
            </div>

            <form className="snap-deck-form" onSubmit={handleSaveDeck}>
                <div className="snap-deck-bar">
                    <label className="snap-deck-name-field">
                        <span>{t('Tên bộ thẻ (Deck Name)', 'Deck Name')}</span>
                        <input
                            type="text"
                            maxLength={60}
                            value={deckName}
                            onChange={e => setDeckName(e.target.value)}
                            placeholder={`Snap - ${localDate()}`}
                            aria-label={t('Tên bộ thẻ', 'Deck Name')}
                        />
                    </label>
                    <button
                        type="submit"
                        className="btn snap-deck-submit"
                        disabled={saving || selectedTokens.size === 0}
                    >
                        {saving ? <Loader2 size={17} className="spin-icon" /> : <Layers size={17} />}
                        <span>
                            {t(
                                `Lưu ${selectedTokens.size} từ vào bộ thẻ`,
                                `Save ${selectedTokens.size} words to Deck`
                            )}
                        </span>
                    </button>
                </div>

                {activeBanner && (
                    <div className="feedback good snap-deck-saved-banner" role="status">
                        <Check size={16} />
                        <span>
                            {t(
                                `Đã tạo / cập nhật bộ thẻ “${activeBanner.deck}” với ${activeBanner.count} từ vựng!`,
                                `Deck “${activeBanner.deck}” saved with ${activeBanner.count} vocabulary cards!`
                            )}
                        </span>
                    </div>
                )}

                <div className="snap-vocab-checklist">
                    {baseItems.map(item => {
                        const checked = selectedTokens.has(item.token);
                        const lookup = lookupMap[item.token];
                        const isLoaded = Object.prototype.hasOwnProperty.call(lookupMap, item.token);
                        const reading = lookup?.reading || item.token;
                        const meaning = lookup
                            ? t(lookup.vi || lookup.en, lookup.en || lookup.vi)
                            : '';
                        const jlpt = lookup?.jlpt ?? '—';

                        return (
                            <div
                                key={item.token}
                                className={`snap-vocab-item ${checked ? 'checked' : ''} ${
                                    item.hasKanji ? 'kanji-word' : ''
                                }`}
                            >
                                <label className="snap-vocab-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleToken(item.token)}
                                    />
                                    <span className="snap-checkbox-visual" aria-hidden="true">
                                        {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </span>
                                    <div className="snap-vocab-content">
                                        <div className="row wrap">
                                            <span className="snap-vocab-jp jp" lang="ja">
                                                {item.token}
                                            </span>
                                            {reading && reading !== item.token && (
                                                <span className="snap-vocab-reading jp" lang="ja">
                                                    ({reading})
                                                </span>
                                            )}
                                            {item.hasKanji && (
                                                <span className="kanji-chip">漢字</span>
                                            )}
                                            {jlpt !== '—' && (
                                                <span className="jlpt-mini-badge">{jlpt}</span>
                                            )}
                                        </div>
                                        {!isLoaded ? (
                                            <small className="muted">
                                                {t('Đang tra từ điển…', 'Looking up definition…')}
                                            </small>
                                        ) : (
                                            <p className="snap-vocab-meaning">{meaning}</p>
                                        )}
                                        {item.sourceSentence && (
                                            <small className="snap-vocab-sentence jp" lang="ja">
                                                「{item.sourceSentence}」
                                            </small>
                                        )}
                                    </div>
                                </label>
                                <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() => speak(item.token)}
                                    aria-label={t('Nghe ', 'Listen to ') + item.token}
                                >
                                    <Volume2 size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </form>
        </section>
    );
}
export { Plus };
