'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function CandidateBar({
    candidates,
    loading,
    hasStrokes,
    source,
    onSelect,
    t,
}: {
    candidates: string[];
    loading: boolean;
    hasStrokes: boolean;
    source?: 'google-ime' | 'fallback';
    onSelect: (char: string) => void;
    t: (vi: string, en: string) => string;
}) {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? candidates : candidates.slice(0, 8);
    return (
        <div
            className="handwriting-candidates"
            role="region"
            aria-label={t('Chữ gợi ý từ nét vẽ', 'Recognized character candidates')}
            aria-live="polite"
            aria-busy={loading}
        >
            {candidates.length > 0 ? (
                <div className={`handwriting-candidate-list ${expanded ? 'expanded' : ''}`} role="group" aria-label={t('Chọn chữ nhận diện', 'Select recognized character')}>
                    {visible.map((char, idx) => (
                        <button
                            key={`${char}-${idx}`}
                            type="button"
                            disabled={loading}
                            className={`handwriting-candidate-btn jp ${idx === 0 ? 'primary-candidate' : ''}`}
                            lang="ja"
                            title={t(`Chèn "${char}" vào ô tìm kiếm`, `Insert "${char}" into search`)}
                            onClick={() => onSelect(char)}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="handwriting-candidate-placeholder">
                    <Sparkles size={14} aria-hidden="true" />
                    <span>
                        {loading
                            ? t('Đang nhận diện nét chữ…', 'Recognizing strokes…')
                            : hasStrokes
                              ? t('Chưa nhận diện được chữ, hãy vẽ thêm nét…', 'Keep drawing strokes to recognize…')
                              : t('Vẽ Kanji hoặc Kana bên dưới để tìm từ…', 'Draw Kanji or Kana below to search…')}
                    </span>
                </div>
            )}
            {loading && candidates.length > 0 && (
                <span className="handwriting-status-pill" aria-hidden="true">
                    {t('Đang lọc…', 'Updating…')}
                </span>
            )}
            {!loading && source === 'fallback' && candidates.length > 0 && (
                <span
                    className="handwriting-status-pill offline"
                    title={t('Dịch vụ chưa có kết quả; đang gợi ý theo số nét trên thiết bị', 'Service unavailable or no result; using local stroke-count suggestions')}
                >
                    {t('Theo số nét', 'Stroke count')}
                </span>
            )}
            {candidates.length > 8 && (
                <button type="button" className="handwriting-more-btn" disabled={loading} onClick={() => setExpanded(value => !value)}>
                    {expanded ? t('Thu gọn', 'Show less') : t(`Xem thêm ${candidates.length - 8} gợi ý`, `Show ${candidates.length - 8} more suggestions`)}
                </button>
            )}
        </div>
    );
}
