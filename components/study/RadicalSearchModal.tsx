'use client';
import { useMemo, useState } from 'react';
import { Filter, Layers, RotateCcw, Sparkles, X } from 'lucide-react';
import {
    getRadicalsByStrokeCount,
    RADICALS_DATA,
    searchKanjiByRadicals,
} from '@/src/services/kanjiService';
import { useStudy } from './context';

const STROKE_GROUPS = getRadicalsByStrokeCount();

export function RadicalSearchModal({
    onSelectKanji,
    onClose,
}: {
    onSelectKanji: (kanji: string) => void;
    onClose: () => void;
}) {
    const { t } = useStudy();
    const [selectedRadicals, setSelectedRadicals] = useState<string[]>([]);
    const [strokeFilter, setStrokeFilter] = useState<number | 'all'>('all');
    const [radicalQuery, setRadicalQuery] = useState<string>('');

    const searchResult = useMemo(
        () => searchKanjiByRadicals(selectedRadicals),
        [selectedRadicals]
    );

    const toggleRadical = (radical: string) => {
        setSelectedRadicals(prev =>
            prev.includes(radical) ? prev.filter(r => r !== radical) : [...prev, radical]
        );
    };

    const filteredGroups = useMemo(() => {
        const q = radicalQuery.trim().toLowerCase();
        return STROKE_GROUPS.filter(
            g => strokeFilter === 'all' || g.strokes === strokeFilter
        )
            .map(g => ({
                ...g,
                radicals: q
                    ? g.radicals.filter(
                          r =>
                              r.radical.includes(q) ||
                              r.nameVi.toLowerCase().includes(q) ||
                              r.meaning.toLowerCase().includes(q)
                      )
                    : g.radicals,
            }))
            .filter(g => g.radicals.length > 0);
    }, [strokeFilter, radicalQuery]);

    const selectedEntries = useMemo(
        () =>
            selectedRadicals
                .map(sym => RADICALS_DATA.find(r => r.radical === sym))
                .filter(Boolean),
        [selectedRadicals]
    );

    return (
        <div
            className="radical-search-popover"
            role="dialog"
            aria-label={t('Tra cứu Kanji theo bộ thủ', 'Multi-radical Kanji search')}
            onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div className="radical-popover-header">
                <div className="radical-popover-title">
                    <Layers size={16} aria-hidden="true" />
                    <span>{t('Tra cứu theo Bộ thủ (214 Bộ Khang Hi)', 'Multi-Radical Kanji Search')}</span>
                    <small className="radical-count-pill">
                        {selectedRadicals.length > 0
                            ? t(
                                  `Đã chọn ${selectedRadicals.length} bộ`,
                                  `${selectedRadicals.length} selected`
                              )
                            : t('1–17 nét', '1–17 strokes')}
                    </small>
                </div>

                <div className="row" style={{ gap: 6 }}>
                    {selectedRadicals.length > 0 && (
                        <button
                            type="button"
                            className="radical-reset-btn"
                            onClick={() => setSelectedRadicals([])}
                            title={t('Xóa các bộ thủ đã chọn', 'Clear selected radicals')}
                        >
                            <RotateCcw size={13} />
                            <span>{t('Xóa chọn', 'Reset')}</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="icon-btn handwriting-close-btn"
                        onClick={onClose}
                        aria-label={t('Đóng bảng bộ thủ', 'Close radical search')}
                    >
                        <X size={17} />
                    </button>
                </div>
            </div>

            {/* Selected Radicals & Quick Combos Bar */}
            <div className="radical-selected-bar">
                {selectedEntries.length > 0 ? (
                    <div className="radical-active-chips">
                        <span className="radical-bar-label">
                            {t('Giao các bộ:', 'Selected:')}
                        </span>
                        {selectedEntries.map(entry =>
                            entry ? (
                                <button
                                    key={entry.radical}
                                    type="button"
                                    className="radical-selected-chip"
                                    onClick={() => toggleRadical(entry.radical)}
                                    title={t('Bỏ chọn bộ này', 'Remove radical')}
                                >
                                    <span className="jp" lang="ja">
                                        {entry.radical}
                                    </span>
                                    <small>{entry.nameVi}</small>
                                    <X size={12} />
                                </button>
                            ) : null
                        )}
                    </div>
                ) : (
                    <div className="radical-quick-presets">
                        <span className="radical-bar-label">
                            <Sparkles size={13} />
                            {t('Thử kết hợp:', 'Try combinations:')}
                        </span>
                        <button
                            type="button"
                            className="radical-preset-btn"
                            onClick={() => setSelectedRadicals(['亻', '木'])}
                        >
                            <span className="jp">亻 + 木</span>
                            <small>→ 休, 体</small>
                        </button>
                        <button
                            type="button"
                            className="radical-preset-btn"
                            onClick={() => setSelectedRadicals(['言', '口'])}
                        >
                            <span className="jp">言 + 口</span>
                            <small>→ 語, 話</small>
                        </button>
                        <button
                            type="button"
                            className="radical-preset-btn"
                            onClick={() => setSelectedRadicals(['木', '父'])}
                        >
                            <span className="jp">木 + 父</span>
                            <small>→ 校</small>
                        </button>
                    </div>
                )}
            </div>

            {/* Matched Kanji Results Grouped by Total Stroke Count */}
            {selectedRadicals.length > 0 && (
                <div className="radical-matched-section" role="region" aria-live="polite">
                    <div className="radical-matched-head">
                        <strong>
                            {t(
                                `Kết quả giao (${searchResult.matchedKanji.length} chữ Kanji):`,
                                `Matched Kanji (${searchResult.matchedKanji.length}):`
                            )}
                        </strong>
                        <small>
                            {t(
                                'Chạm vào chữ Kanji để chèn và xem thứ tự nét',
                                'Click a Kanji to insert and open stroke order'
                            )}
                        </small>
                    </div>

                    {searchResult.groupedByStrokes.length > 0 ? (
                        <div className="radical-matched-groups">
                            {searchResult.groupedByStrokes.map(group => (
                                <div key={group.strokes} className="radical-matched-group">
                                    <span className="radical-matched-stroke-tag">
                                        {group.strokes} {t('nét', 'strokes')}
                                    </span>
                                    <div className="radical-matched-items">
                                        {group.items.map(item => (
                                            <button
                                                key={item.kanji}
                                                type="button"
                                                className="radical-matched-kanji-btn"
                                                onClick={() => onSelectKanji(item.kanji)}
                                                title={`${item.kanji} (${item.hanViet}) - ${item.meaningVi}`}
                                            >
                                                <span className="jp" lang="ja">
                                                    {item.kanji}
                                                </span>
                                                <small>{item.hanViet}</small>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="radical-empty-match">
                            {t(
                                'Không có chữ Kanji nào chứa đồng thời các bộ thủ này.',
                                'No Kanji contains all selected radicals.'
                            )}
                        </p>
                    )}
                </div>
            )}

            {/* Filter by Stroke Count & Radical Name */}
            <div className="radical-filter-controls">
                <div className="radical-search-input-wrap">
                    <Filter size={14} />
                    <input
                        type="text"
                        value={radicalQuery}
                        onChange={e => setRadicalQuery(e.target.value)}
                        placeholder={t(
                            'Tìm tên bộ thủ (VD: Nhân đứng, Mộc, Ngôn…)',
                            'Filter radical name (e.g. Person, Tree, Speech…)'
                        )}
                        aria-label={t('Lọc tên bộ thủ', 'Filter radicals by name')}
                    />
                    {radicalQuery && (
                        <button
                            type="button"
                            className="icon-btn"
                            style={{ width: 24, height: 24 }}
                            onClick={() => setRadicalQuery('')}
                            aria-label={t('Xóa lọc bộ thủ', 'Clear radical filter')}
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                <div
                    className="radical-stroke-pills"
                    role="group"
                    aria-label={t('Lọc theo số nét bộ thủ', 'Filter radicals by stroke count')}
                >
                    <button
                        type="button"
                        className={`radical-stroke-filter-pill ${strokeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStrokeFilter('all')}
                    >
                        {t('Tất cả', 'All')}
                    </button>
                    {STROKE_GROUPS.map(g => (
                        <button
                            key={g.strokes}
                            type="button"
                            className={`radical-stroke-filter-pill ${strokeFilter === g.strokes ? 'active' : ''}`}
                            onClick={() =>
                                setStrokeFilter(prev => (prev === g.strokes ? 'all' : g.strokes))
                            }
                        >
                            {g.strokes} {t('nét', 'st')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Radicals Grid Grouped by Stroke Count */}
            <div className="radical-groups-scroll">
                {filteredGroups.map(group => (
                    <div key={group.strokes} className="radical-stroke-group">
                        <div className="radical-group-heading">
                            <span>
                                {group.strokes} {t('nét', group.strokes === 1 ? 'stroke' : 'strokes')}
                            </span>
                            <small>
                                {group.radicals.length} {t('bộ', 'radicals')}
                            </small>
                        </div>
                        <div className="radical-buttons-grid">
                            {group.radicals.map(rad => {
                                const isSelected = selectedRadicals.includes(rad.radical);
                                const isCompatible = searchResult.compatibleRadicals.has(
                                    rad.radical
                                );
                                return (
                                    <button
                                        key={`${rad.id}-${rad.radical}`}
                                        type="button"
                                        disabled={!isCompatible && !isSelected}
                                        className={`radical-picker-btn ${
                                            isSelected ? 'selected' : ''
                                        } ${!isCompatible && !isSelected ? 'dimmed' : ''}`}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleRadical(rad.radical)}
                                        title={`${rad.radical} — Bộ ${rad.nameVi} (${rad.strokes} nét): ${rad.meaning}`}
                                    >
                                        <span className="radical-glyph jp" lang="ja">
                                            {rad.radical}
                                        </span>
                                        <span className="radical-name">{rad.nameVi}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
