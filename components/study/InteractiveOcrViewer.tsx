'use client';
/* eslint-disable @next/next/no-img-element -- Scanned OCR images are local data URLs with percentage bounding boxes. */

import { useEffect, useState } from 'react';
import { BookOpen, Check, Eye, EyeOff, Loader2, Plus, Search, Sparkles, Volume2, X } from 'lucide-react';
import {
    type OcrBoxItem,
    type OcrRecognitionResult,
    bboxToPercentageStyle,
} from '@/lib/study/ocrService';
import {
    type DictionaryLookupResult,
    lookupJapaneseWord,
    lookupResultToWord,
} from '@/lib/study/jishoService';
import { type Word, normalize } from '@/lib/study/core';
import { useStudy } from './context';

export type InteractiveOcrViewerProps = {
    imageSrc: string;
    result: OcrRecognitionResult;
    thumbnail?: string;
    selectedDeck?: string;
    onDeckChange?: (deck: string) => void;
    onSelectWordForSearch?: (word: string) => void;
    onEditWord?: (word: Word) => void;
};

export function InteractiveOcrViewer({
    imageSrc,
    result,
    thumbnail,
    selectedDeck,
    onDeckChange,
    onSelectWordForSearch,
    onEditWord,
}: InteractiveOcrViewerProps) {
    const { s, t, save, speak } = useStudy();
    const [granularity, setGranularity] = useState<'words' | 'symbols'>('words');
    const [showBoxes, setShowBoxes] = useState(true);
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
    const [lookupState, setLookupState] = useState<{
        key: string;
        data: DictionaryLookupResult | null;
    }>({ key: '', data: null });

    const deck = selectedDeck || s.decks[0] || 'My words';

    const boxes: OcrBoxItem[] =
        granularity === 'words' && result.words.length > 0
            ? result.words
            : result.symbols.length > 0
            ? result.symbols
            : result.words;

    const defaultBox = boxes.find(b => b.hasKanji) ?? boxes[0] ?? null;
    const activeBox: OcrBoxItem | null =
        selectedBoxId === '__closed__'
            ? null
            : boxes.find(b => b.id === selectedBoxId) ?? defaultBox;

    const activeKey = activeBox ? `${activeBox.text}::${activeBox.lineText}` : '';
    const loadingLookup = Boolean(activeBox && lookupState.key !== activeKey);
    const lookup = activeBox && lookupState.key === activeKey ? lookupState.data : null;

    useEffect(() => {
        if (!activeBox) return;
        const targetKey = `${activeBox.text}::${activeBox.lineText}`;
        const controller = new AbortController();

        lookupJapaneseWord(activeBox.text, {
            signal: controller.signal,
            sourceSentence: activeBox.lineText || result.text.split('\n')[0] || '',
        })
            .then(res => {
                if (!controller.signal.aborted) {
                    setLookupState({ key: targetKey, data: res });
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setLookupState({ key: targetKey, data: null });
                }
            });

        return () => controller.abort();
    }, [activeBox, result.text]);

    const alreadySaved = lookup
        ? s.cards.some(
              c =>
                  c.deck === deck &&
                  normalize(c.jp) === normalize(lookup.word) &&
                  normalize(c.kana) === normalize(lookup.reading || lookup.word)
          )
        : false;

    function handleAddFlashcard() {
        if (!lookup) return;
        const wordObj = lookupResultToWord(
            lookup,
            activeBox?.lineText || result.lines[0] || ''
        );
        save(wordObj, deck, thumbnail);
    }

    return (
        <div className="ocr-interactive-suite">
            <div className="ocr-viewer-toolbar">
                <div className="ocr-viewer-heading">
                    <span className="eyebrow">
                        {t('CHẠM VÀO CHỮ TRÊN ẢNH · TAP-TO-LOOKUP', 'INTERACTIVE OCR · TAP-TO-LOOKUP')}
                    </span>
                    <p className="ocr-viewer-sub">
                        {t(
                            `Đã nhận diện ${result.words.length} cụm từ và ${result.symbols.length} ký tự. Chạm vào bất kỳ khung chữ nào trên ảnh để tra nghĩa và JLPT.`,
                            `Detected ${result.words.length} word boxes and ${result.symbols.length} character boxes. Tap any bounding box on the image to look up definitions and JLPT.`
                        )}
                    </p>
                </div>
                <div className="ocr-viewer-controls">
                    <div className="ocr-box-mode-toggle" role="group" aria-label={t('Chế độ khung', 'Box granularity')}>
                        <button
                            type="button"
                            className={granularity === 'words' ? 'active' : ''}
                            onClick={() => setGranularity('words')}
                        >
                            {t('Theo từ (単語)', 'Words (単語)')}
                        </button>
                        <button
                            type="button"
                            className={granularity === 'symbols' ? 'active' : ''}
                            onClick={() => setGranularity('symbols')}
                        >
                            {t('Theo ký tự (文字)', 'Chars (文字)')}
                        </button>
                    </div>
                    <button
                        type="button"
                        className="btn secondary compact"
                        onClick={() => setShowBoxes(v => !v)}
                        aria-pressed={showBoxes}
                    >
                        {showBoxes ? <EyeOff size={15} /> : <Eye size={15} />}
                        <span>{showBoxes ? t('Ẩn khung', 'Hide boxes') : t('Hiện khung', 'Show boxes')}</span>
                    </button>
                </div>
            </div>

            <div className="ocr-viewer-stage-grid">
                <div className="ocr-image-container">
                    <div className="ocr-image-canvas-wrap">
                        <img
                            src={imageSrc || result.processedImageUrl}
                            alt={t('Ảnh đã quét OCR tiếng Nhật', 'Scanned Japanese OCR image')}
                            className="ocr-stage-img"
                        />
                        {showBoxes &&
                            boxes.map(item => {
                                const style = bboxToPercentageStyle(
                                    item.bbox,
                                    result.imageWidth,
                                    result.imageHeight
                                );
                                const isSelected = activeBox?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        style={style}
                                        className={`ocr-bbox-overlay ${item.hasKanji ? 'has-kanji' : 'kana-only'} ${
                                            isSelected ? 'selected' : ''
                                        }`}
                                        onClick={() => setSelectedBoxId(item.id)}
                                        aria-label={`${t('Tra từ', 'Look up')} ${item.text}`}
                                        title={`${item.text} (${item.confidence}%)`}
                                    >
                                        <span className="sr-only">{item.text}</span>
                                    </button>
                                );
                            })}
                    </div>
                    {boxes.length > 0 && (
                        <div className="ocr-token-strip" aria-label={t('Từ trên ảnh', 'Words in image')}>
                            <span className="ocr-token-strip-label">
                                {t('Chạm nhanh:', 'Quick tap:')}
                            </span>
                            {result.words.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`ocr-token-chip jp ${activeBox?.id === item.id ? 'active' : ''}`}
                                    onClick={() => setSelectedBoxId(item.id)}
                                    lang="ja"
                                >
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tap-to-Lookup Popover / Drawer Panel */}
                <div className="ocr-lookup-drawer panel" role="region" aria-live="polite" aria-label={t('Tra cứu từ đã chọn', 'Selected word lookup')}>
                    {activeBox ? (
                        <>
                            <div className="ocr-lookup-header">
                                <div className="row wrap">
                                    <span className={`jlpt-badge ${lookup?.jlpt && lookup.jlpt !== '—' ? 'has-level' : ''}`}>
                                        {lookup?.jlpt && lookup.jlpt !== '—'
                                            ? `JLPT ${lookup.jlpt}`
                                            : t('Từ vựng OCR', 'OCR Word')}
                                    </span>
                                    {lookup?.source && (
                                        <span className="lookup-source-pill">
                                            {lookup.source === 'internal'
                                                ? t('Từ điển nội bộ', 'Internal Dict')
                                                : lookup.source === 'jisho'
                                                ? 'Jisho.org'
                                                : lookup.source === 'kanjiapi'
                                                ? 'KanjiAPI.dev'
                                                : 'Tesseract OCR'}
                                        </span>
                                    )}
                                    <span className="ocr-conf-pill" title={t('Độ tin cậy OCR', 'OCR confidence')}>
                                        {activeBox.confidence}%
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="icon-btn"
                                    aria-label={t('Đóng khung tra từ', 'Close word lookup')}
                                    onClick={() => setSelectedBoxId('__closed__')}
                                >
                                    <X size={17} />
                                </button>
                            </div>

                            {loadingLookup ? (
                                <div className="ocr-lookup-loading">
                                    <Loader2 size={22} className="spin-icon" />
                                    <p>{t(`Đang tra từ “${activeBox.text}”…`, `Looking up “${activeBox.text}”…`)}</p>
                                </div>
                            ) : lookup ? (
                                <div className="ocr-lookup-body">
                                    <div className="ocr-lookup-word-row">
                                        <div>
                                            <div className="ocr-lookup-jp jp" lang="ja">
                                                {lookup.reading && lookup.reading !== lookup.word ? (
                                                    <ruby>
                                                        {lookup.word}
                                                        <rt>{lookup.reading}</rt>
                                                    </ruby>
                                                ) : (
                                                    lookup.word
                                                )}
                                            </div>
                                            <p className="ocr-lookup-reading">
                                                <span className="jp" lang="ja">
                                                    {lookup.reading}
                                                </span>
                                                {lookup.romaji && <span> · {lookup.romaji}</span>}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="icon-btn bordered"
                                            onClick={() => speak(lookup.word)}
                                            aria-label={t('Nghe phát âm ', 'Listen to ') + lookup.word}
                                            title={t('Nghe phát âm', 'Listen')}
                                        >
                                            <Volume2 size={18} />
                                        </button>
                                    </div>

                                    {lookup.partsOfSpeech.length > 0 && (
                                        <div className="ocr-pos-row">
                                            {lookup.partsOfSpeech.map(pos => (
                                                <span key={pos} className="tag">
                                                    {pos}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="ocr-lookup-meaning">
                                        <h4>{t('Ý nghĩa', 'Meaning')}</h4>
                                        <strong>{t(lookup.vi || lookup.en, lookup.en || lookup.vi)}</strong>
                                        {lookup.vi && lookup.en && lookup.vi !== lookup.en && (
                                            <p className="muted">{s.settings.lang === 'vi' ? lookup.en : lookup.vi}</p>
                                        )}
                                    </div>

                                    {lookup.kanjiDetails && lookup.kanjiDetails.length > 0 && (
                                        <div className="ocr-kanji-breakdown">
                                            <span className="eyebrow">KANJI · 漢字</span>
                                            {lookup.kanjiDetails.map(k => (
                                                <div key={k.kanji} className="ocr-kanji-item">
                                                    <span className="ocr-kanji-char jp" lang="ja">
                                                        {k.kanji}
                                                    </span>
                                                    <div>
                                                        <strong>{k.meanings.slice(0, 3).join(', ')}</strong>
                                                        <small className="jp" lang="ja">
                                                            {k.kunReadings.slice(0, 2).join('・')}
                                                            {k.onReadings.length > 0
                                                                ? ` / ${k.onReadings.slice(0, 2).join('・')}`
                                                                : ''}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(activeBox.lineText || lookup.example) && (
                                        <div className="ocr-lookup-context">
                                            <span className="eyebrow">
                                                {t('CÂU TRONG ẢNH · SOURCE SENTENCE', 'SOURCE SENTENCE IN IMAGE')}
                                            </span>
                                            <p className="jp" lang="ja">
                                                {activeBox.lineText || lookup.example}
                                            </p>
                                        </div>
                                    )}

                                    <div className="ocr-lookup-actions">
                                        {onDeckChange && (
                                            <label className="ocr-deck-picker">
                                                <span>{t('Bộ thẻ:', 'Deck:')}</span>
                                                <select value={deck} onChange={e => onDeckChange(e.target.value)}>
                                                    {s.decks.map(d => (
                                                        <option key={d} value={d}>
                                                            {d}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        )}
                                        <div className="row wrap">
                                            <button
                                                type="button"
                                                className={`btn ${alreadySaved ? 'secondary' : ''}`}
                                                disabled={alreadySaved}
                                                onClick={handleAddFlashcard}
                                            >
                                                {alreadySaved ? <Check size={16} /> : <Plus size={16} />}
                                                {alreadySaved
                                                    ? t('Đã lưu trong bộ thẻ', 'Saved in deck')
                                                    : t('Lưu vào Thẻ từ vựng', 'Add to Flashcards')}
                                            </button>
                                            {onEditWord && (
                                                <button
                                                    type="button"
                                                    className="btn secondary"
                                                    onClick={() =>
                                                        onEditWord(
                                                            lookupResultToWord(
                                                                lookup,
                                                                activeBox.lineText || result.lines[0] || ''
                                                            )
                                                        )
                                                    }
                                                >
                                                    {t('Sửa trước khi lưu', 'Edit before saving')}
                                                </button>
                                            )}
                                            {onSelectWordForSearch && (
                                                <button
                                                    type="button"
                                                    className="btn secondary"
                                                    onClick={() => onSelectWordForSearch(lookup.word)}
                                                >
                                                    <Search size={16} />
                                                    {t('Dùng để tìm kiếm', 'Search this word')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="ocr-lookup-empty">
                            <BookOpen size={28} />
                            <h3>{t('Chạm vào một từ trên ảnh', 'Tap any word on the image')}</h3>
                            <p>
                                {t(
                                    'Chọn một khung viền trên ảnh (hoặc thẻ từ bên dưới ảnh) để xem cách đọc Furigana, cấp độ JLPT và lưu ngay vào Flashcard.',
                                    'Click any highlighted box on the scanned photo to see Furigana readings, JLPT level, definitions, and add it to Flashcards.'
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {result.text && (
                <div className="panel ocr-extracted-text-box">
                    <div className="row spread wrap">
                        <div>
                            <span className="eyebrow">
                                {result.orientation === 'vertical'
                                    ? '縦書き · VERTICAL OCR TEXT'
                                    : '横書き · HORIZONTAL OCR TEXT'}
                            </span>
                            <h3>{t('Toàn bộ văn bản trích xuất', 'Full recognized Japanese text')}</h3>
                        </div>
                        <button
                            type="button"
                            className="btn secondary compact"
                            onClick={() => speak(result.text)}
                        >
                            <Volume2 size={16} />
                            <span>{t('Nghe toàn đoạn', 'Listen all')}</span>
                        </button>
                    </div>
                    <p className="ocr-full-text jp" lang="ja">
                        {result.text}
                    </p>
                </div>
            )}
        </div>
    );
}
export { Sparkles };
