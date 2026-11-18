'use client';
import { useState } from 'react';
import { Layers, Sparkles } from 'lucide-react';
import {
    getKanjiRadicals,
    getKanjiSummary,
    type RadicalEntry,
} from '@/src/services/kanjiService';
import { useStudy } from './context';

export function RadicalBreakdown({
    kanji,
    onSelectKanji,
}: {
    kanji: string;
    onSelectKanji?: (nextKanji: string) => void;
}) {
    const { t } = useStudy();
    const radicals = getKanjiRadicals(kanji);
    const [selectedRadical, setSelectedRadical] = useState<string | null>(null);

    const activeEntry: RadicalEntry | undefined =
        radicals.find(r => r.radical === selectedRadical) ?? radicals[0];

    if (radicals.length === 0) {
        return null;
    }

    return (
        <section
            className="radical-breakdown-card"
            aria-label={t(`Phân tích bộ thủ chữ ${kanji}`, `Radical breakdown for ${kanji}`)}
        >
            <div className="radical-breakdown-header">
                <div className="eyebrow">
                    <Layers size={13} />
                    <span>{t('PHÂN TÍCH BỘ THỦ · RADICAL BREAKDOWN', 'RADICAL BREAKDOWN · 部首分解')}</span>
                </div>
                <span className="radical-formula jp" lang="ja">
                    <strong>{kanji}</strong>
                    {' = '}
                    {radicals.map((r, idx) => (
                        <span key={r.radical}>
                            {idx > 0 && ' + '}
                            {r.radical} <small>({r.nameVi} - {r.strokes} {t('nét', 'strokes')})</small>
                        </span>
                    ))}
                </span>
            </div>

            <div className="radical-chip-list" role="group" aria-label={t('Danh sách bộ thủ', 'Constituent radicals')}>
                {radicals.map(rad => {
                    const isSelected = (activeEntry?.radical ?? '') === rad.radical;
                    return (
                        <button
                            key={rad.radical}
                            type="button"
                            className={`radical-chip-btn ${isSelected ? 'active' : ''}`}
                            aria-pressed={isSelected}
                            onClick={() =>
                                setSelectedRadical(prev =>
                                    prev === rad.radical ? null : rad.radical
                                )
                            }
                        >
                            <span className="radical-chip-char jp" lang="ja">
                                {rad.radical}
                            </span>
                            <div className="radical-chip-meta">
                                <strong>
                                    {rad.nameVi}{' '}
                                    <span className="radical-stroke-pill">
                                        {rad.strokes} {t('nét', 'strokes')}
                                    </span>
                                </strong>
                                <small>{rad.meaning}</small>
                            </div>
                        </button>
                    );
                })}
            </div>

            {activeEntry && (
                <div className="radical-related-panel">
                    <div className="radical-related-title">
                        <Sparkles size={13} />
                        <span>
                            {t(
                                `Chữ Kanji cùng bộ ${activeEntry.radical} (${activeEntry.nameVi} · ${activeEntry.strokes} nét):`,
                                `Kanji sharing radical ${activeEntry.radical} (${activeEntry.nameVi} · ${activeEntry.strokes} strokes):`
                            )}
                        </span>
                    </div>
                    <div className="radical-related-grid">
                        {activeEntry.kanjiList.slice(0, 14).map(k => {
                            const info = getKanjiSummary(k);
                            const isCurrent = k === kanji;
                            return (
                                <button
                                    key={k}
                                    type="button"
                                    className={`radical-related-kanji ${isCurrent ? 'current' : ''}`}
                                    onClick={() => onSelectKanji?.(k)}
                                    title={`${k} (${info.hanViet}) - ${info.meaningVi}`}
                                >
                                    <span className="jp" lang="ja">
                                        {k}
                                    </span>
                                    <small>{info.hanViet}</small>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
