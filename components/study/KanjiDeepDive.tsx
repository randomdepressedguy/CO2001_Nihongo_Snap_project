'use client';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Edit3, PlayCircle, Volume2 } from 'lucide-react';
import {
    extractKanjiCharacters,
    fetchKanjiMetadata,
    fetchKanjiStrokes,
    getLocalKanjiMetadata,
    type KanjiMetadata,
    type KanjiStrokeData,
} from '@/src/services/kanjiService';
import { KanjiStrokePlayer } from './KanjiStrokePlayer';
import { KanjiTracingCanvas } from './KanjiTracingCanvas';
import { RadicalBreakdown } from './RadicalBreakdown';
import { useStudy } from './context';

export function KanjiDeepDive({
    text,
    initialKanji,
}: {
    text: string;
    initialKanji?: string;
}) {
    const { t, speak } = useStudy();
    const baseKanjiList = useMemo(() => extractKanjiCharacters(text), [text]);
    const [extraKanji, setExtraKanji] = useState<string[]>([]);
    const [selectedKanji, setSelectedKanji] = useState<string | null>(
        initialKanji ?? null
    );
    const [mode, setMode] = useState<'player' | 'tracing'>('player');
    const [loadedStrokeMap, setLoadedStrokeMap] = useState<
        Record<string, KanjiStrokeData>
    >({});
    const [loadedMetaMap, setLoadedMetaMap] = useState<
        Record<string, KanjiMetadata>
    >({});

    const kanjiTabs = useMemo(() => {
        const list = [...baseKanjiList];
        if (initialKanji && !list.includes(initialKanji)) {
            list.unshift(initialKanji);
        }
        for (const k of extraKanji) {
            if (!list.includes(k)) list.push(k);
        }
        return list;
    }, [baseKanjiList, initialKanji, extraKanji]);

    const activeKanji =
        selectedKanji && kanjiTabs.includes(selectedKanji)
            ? selectedKanji
            : initialKanji || kanjiTabs[0] || '';

    const strokeData = activeKanji ? loadedStrokeMap[activeKanji] ?? null : null;
    const loadingStrokes = Boolean(activeKanji && !strokeData);
    const metadata = activeKanji
        ? loadedMetaMap[activeKanji] ?? getLocalKanjiMetadata(activeKanji)
        : null;

    // Fetch KanjiVG strokes and KanjiAPI.dev metadata asynchronously
    useEffect(() => {
        if (!activeKanji) return;
        const controller = new AbortController();

        fetchKanjiStrokes(activeKanji, { signal: controller.signal })
            .then(data => {
                if (!controller.signal.aborted) {
                    setLoadedStrokeMap(prev => ({ ...prev, [activeKanji]: data }));
                }
            })
            .catch(() => {
                // Ignore abort / network errors
            });

        fetchKanjiMetadata(activeKanji, { signal: controller.signal })
            .then(meta => {
                if (!controller.signal.aborted) {
                    setLoadedMetaMap(prev => ({ ...prev, [activeKanji]: meta }));
                }
            })
            .catch(() => {
                // Keep local metadata fallback
            });

        return () => controller.abort();
    }, [activeKanji]);

    if (!activeKanji) {
        return null;
    }

    const handleSelectRelatedKanji = (nextKanji: string) => {
        setExtraKanji(prev =>
            prev.includes(nextKanji) ? prev : [...prev, nextKanji]
        );
        setSelectedKanji(nextKanji);
    };

    const strokeCount = strokeData?.strokes.length || metadata?.stroke_count || 0;

    return (
        <section
            className="kanji-deep-dive"
            aria-label={t(`Chi tiết chữ Hán ${activeKanji}`, `Kanji deep dive for ${activeKanji}`)}
        >
            <div className="kanji-deep-dive-head">
                <div>
                    <span className="eyebrow">
                        <BookOpen size={13} />
                        <span>{t('PHÂN TÍCH CHỮ HÁN · KANJI MASTERY', 'KANJI MASTERY · 漢字解剖')}</span>
                    </span>
                    <h3>
                        {t(
                            'Thứ tự nét viết, luyện viết & bộ thủ',
                            'Stroke order, interactive tracing & radicals'
                        )}
                    </h3>
                </div>

                {kanjiTabs.length > 1 && (
                    <div
                        className="kanji-char-tabs"
                        role="tablist"
                        aria-label={t('Chọn chữ Hán trong từ', 'Select Kanji character')}
                    >
                        {kanjiTabs.map(k => (
                            <button
                                key={k}
                                type="button"
                                role="tab"
                                aria-selected={activeKanji === k}
                                className={`kanji-char-tab jp ${activeKanji === k ? 'active' : ''}`}
                                onClick={() => setSelectedKanji(k)}
                            >
                                {k}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Metadata Card (Local N5-N4 + KanjiAPI.dev) */}
            <div className="kanji-meta-summary">
                <div className="kanji-meta-char-box">
                    <span className="kanji-meta-glyph jp" lang="ja">
                        {activeKanji}
                    </span>
                    <button
                        type="button"
                        className="icon-btn kanji-speak-btn"
                        onClick={() => speak(activeKanji)}
                        aria-label={t(`Nghe phát âm ${activeKanji}`, `Listen to ${activeKanji}`)}
                        title={t('Nghe phát âm', 'Listen')}
                    >
                        <Volume2 size={16} />
                    </button>
                </div>

                <div className="kanji-meta-details">
                    <div className="kanji-meta-badges">
                        {metadata?.hanViet && (
                            <span className="kanji-badge hanviet">{metadata.hanViet}</span>
                        )}
                        {strokeCount > 0 && (
                            <span className="kanji-badge strokes">
                                {strokeCount} {t('nét', 'strokes')}
                            </span>
                        )}
                        {metadata?.jlptLabel && (
                            <span className="kanji-badge jlpt">{metadata.jlptLabel}</span>
                        )}
                        {metadata?.grade && (
                            <span className="kanji-badge grade">
                                {t(`Cấp ${metadata.grade}`, `Grade ${metadata.grade}`)}
                            </span>
                        )}
                        {metadata?.heisig_en && (
                            <span className="kanji-badge heisig">
                                Heisig: {metadata.heisig_en}
                            </span>
                        )}
                    </div>

                    <p className="kanji-meta-meaning">
                        <strong>
                            {t(
                                metadata?.meaningVi || metadata?.meanings.join('; ') || activeKanji,
                                metadata?.meanings.join('; ') || metadata?.meaningVi || activeKanji
                            )}
                        </strong>
                        {metadata?.meanings && metadata.meanings.length > 0 && (
                            <small> · {metadata.meanings.slice(0, 4).join(', ')}</small>
                        )}
                    </p>

                    <div className="kanji-readings-row">
                        <div>
                            <small>ON (音)</small>
                            <span className="jp" lang="ja">
                                {metadata?.on_readings?.length
                                    ? metadata.on_readings.join('・')
                                    : '—'}
                            </span>
                        </div>
                        <div>
                            <small>KUN (訓)</small>
                            <span className="jp" lang="ja">
                                {metadata?.kun_readings?.length
                                    ? metadata.kun_readings.join('・')
                                    : '—'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mode Switcher: Animated Stroke Order Player vs Interactive Stroke Tracing */}
            <div className="kanji-mode-switcher" role="tablist" aria-label={t('Chế độ học nét viết', 'Stroke study mode')}>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'player'}
                    className={`kanji-mode-btn ${mode === 'player' ? 'active' : ''}`}
                    onClick={() => setMode('player')}
                >
                    <PlayCircle size={16} />
                    <span>{t('Thứ tự nét (Stroke Order)', 'Stroke Order Player')}</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'tracing'}
                    className={`kanji-mode-btn ${mode === 'tracing' ? 'active' : ''}`}
                    onClick={() => setMode('tracing')}
                >
                    <Edit3 size={16} />
                    <span>{t('Luyện viết (Practice Tracing)', 'Practice Tracing')}</span>
                </button>
            </div>

            <div className="kanji-stage-container">
                {mode === 'player' ? (
                    <KanjiStrokePlayer
                        key={`player-${activeKanji}-${strokeData?.strokes.length ?? 0}`}
                        strokeData={strokeData}
                        loading={loadingStrokes}
                    />
                ) : (
                    <KanjiTracingCanvas
                        key={`tracing-${activeKanji}-${strokeData?.strokes.length ?? 0}`}
                        strokeData={strokeData}
                    />
                )}
            </div>

            {/* Radical Breakdown Card */}
            <RadicalBreakdown kanji={activeKanji} onSelectKanji={handleSelectRelatedKanji} />
        </section>
    );
}
