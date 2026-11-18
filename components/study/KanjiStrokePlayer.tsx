'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Eye,
    EyeOff,
    Pause,
    Play,
    RotateCcw,
    SkipBack,
    SkipForward,
} from 'lucide-react';
import type { KanjiStrokeData } from '@/src/services/kanjiService';
import { useStudy } from './context';

export type PlaybackSpeed = 0.5 | 1 | 2;

export function KanjiStrokePlayer({
    strokeData,
    loading = false,
}: {
    strokeData: KanjiStrokeData | null;
    loading?: boolean;
}) {
    const { t } = useStudy();
    const strokes = useMemo(() => strokeData?.strokes ?? [], [strokeData]);
    const totalStrokes = strokes.length;

    // currentStroke: number of completed/visible strokes (1..totalStrokes)
    const [currentStroke, setCurrentStroke] = useState<number>(() =>
        totalStrokes > 0 ? 1 : 0
    );
    // animatingStroke: 1-based index of the stroke currently animating via stroke-dashoffset
    const [animatingStroke, setAnimatingStroke] = useState<number | null>(() =>
        totalStrokes > 0 ? 1 : null
    );
    const [animProgress, setAnimProgress] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(() => totalStrokes > 0);
    const [speed, setSpeed] = useState<PlaybackSpeed>(1);
    const [showNumbers, setShowNumbers] = useState<boolean>(true);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    const clearTimers = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (rafRef.current !== null && typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    // Sequential stroke animation loop using CSS stroke-dasharray & stroke-dashoffset
    useEffect(() => {
        clearTimers();
        if (!isPlaying || totalStrokes === 0) {
            return;
        }

        const targetIndex = Math.max(1, Math.min(totalStrokes, currentStroke || 1));
        const stroke = strokes[targetIndex - 1];
        const baseDurationMs = Math.max(260, Math.min(750, (stroke?.length ?? 50) * 8));
        const durationMs = Math.round(baseDurationMs / speed);

        rafRef.current = requestAnimationFrame(() => {
            setAnimatingStroke(targetIndex);
            setAnimProgress(false);
            rafRef.current = requestAnimationFrame(() => {
                setAnimProgress(true);
            });
        });

        timerRef.current = setTimeout(() => {
            if (targetIndex < totalStrokes) {
                setCurrentStroke(targetIndex + 1);
            } else {
                setAnimatingStroke(null);
                setIsPlaying(false);
            }
        }, durationMs + 70);

        return clearTimers;
    }, [isPlaying, currentStroke, speed, totalStrokes, strokes]);

    const handlePlayPause = () => {
        if (totalStrokes === 0) return;
        if (isPlaying) {
            clearTimers();
            setIsPlaying(false);
            setAnimatingStroke(null);
        } else {
            if (currentStroke >= totalStrokes && animatingStroke === null) {
                setCurrentStroke(1);
            }
            setIsPlaying(true);
        }
    };

    const handleReplay = () => {
        if (totalStrokes === 0) return;
        clearTimers();
        setCurrentStroke(1);
        setAnimatingStroke(1);
        setAnimProgress(false);
        setIsPlaying(true);
    };

    const handlePrevStroke = () => {
        if (totalStrokes === 0) return;
        clearTimers();
        setIsPlaying(false);
        setAnimatingStroke(null);
        setCurrentStroke(prev => Math.max(1, prev - 1));
    };

    const handleNextStroke = () => {
        if (totalStrokes === 0) return;
        clearTimers();
        setIsPlaying(false);
        setAnimatingStroke(null);
        setCurrentStroke(prev => Math.min(totalStrokes, prev + 1));
    };

    return (
        <div className="kanji-stroke-player">
            <div className="kanji-svg-stage-wrap">
                <svg
                    viewBox="0 0 109 109"
                    className="kanji-svg-stage"
                    role="img"
                    aria-label={
                        strokeData
                            ? t(
                                  `Thứ tự nét viết chữ ${strokeData.kanji} (${totalStrokes} nét)`,
                                  `Stroke order for ${strokeData.kanji} (${totalStrokes} strokes)`
                              )
                            : t('Khung thứ tự nét Kanji', 'Kanji stroke order grid')
                    }
                >
                    {/* Mizugaki (Crosshair + Diagonal) Guide Lines */}
                    <g className="mizugaki-guides" aria-hidden="true">
                        <rect
                            x="2"
                            y="2"
                            width="105"
                            height="105"
                            rx="4"
                            fill="#fffdf7"
                            stroke="#d6ccb5"
                            strokeWidth="1.2"
                        />
                        <line
                            x1="54.5"
                            y1="2"
                            x2="54.5"
                            y2="107"
                            stroke="#cfc4ac"
                            strokeWidth="0.9"
                            strokeDasharray="3.5 3.5"
                        />
                        <line
                            x1="2"
                            y1="54.5"
                            x2="107"
                            y2="54.5"
                            stroke="#cfc4ac"
                            strokeWidth="0.9"
                            strokeDasharray="3.5 3.5"
                        />
                        <line
                            x1="2"
                            y1="2"
                            x2="107"
                            y2="107"
                            stroke="#e5decb"
                            strokeWidth="0.7"
                            strokeDasharray="2.5 3.5"
                        />
                        <line
                            x1="107"
                            y1="2"
                            x2="2"
                            y2="107"
                            stroke="#e5decb"
                            strokeWidth="0.7"
                            strokeDasharray="2.5 3.5"
                        />
                    </g>

                    {/* Faint background ghost strokes for full character reference */}
                    <g
                        className="kanji-ghost-strokes"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        {strokes.map(s => (
                            <path key={`ghost-${s.id}`} d={s.d} />
                        ))}
                    </g>

                    {/* Active & completed animated strokes */}
                    <g
                        className="kanji-active-strokes"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {strokes.map(s => {
                            const isVisible = s.index <= currentStroke;
                            if (!isVisible) return null;
                            const isAnimatingThis = animatingStroke === s.index;
                            const isHighlighted = s.index === currentStroke;
                            const dashLen = Math.ceil((s.length || 60) + 16);
                            const baseDurationMs = Math.max(
                                260,
                                Math.min(750, (s.length || 50) * 8)
                            );
                            const durationMs = Math.round(baseDurationMs / speed);

                            return (
                                <path
                                    key={s.id}
                                    id={s.id}
                                    d={s.d}
                                    stroke={isHighlighted ? '#a83d32' : '#1f2d37'}
                                    strokeWidth={isHighlighted ? '4.6' : '4.2'}
                                    style={{
                                        strokeDasharray: `${dashLen}`,
                                        strokeDashoffset:
                                            isAnimatingThis && !animProgress ? `${dashLen}` : '0',
                                        transition:
                                            isAnimatingThis && animProgress
                                                ? `stroke-dashoffset ${durationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
                                                : 'none',
                                    }}
                                />
                            );
                        })}
                    </g>

                    {/* Start dot on the current stroke */}
                    {strokes[currentStroke - 1] && (
                        <circle
                            cx={strokes[currentStroke - 1].startPoint.x}
                            cy={strokes[currentStroke - 1].startPoint.y}
                            r="2.7"
                            fill="#a83d32"
                            aria-hidden="true"
                        />
                    )}

                    {/* Optional Stroke Order Numbers */}
                    {showNumbers && (
                        <g className="kanji-stroke-numbers" aria-hidden="true">
                            {strokes.map(s => {
                                if (s.index > currentStroke) return null;
                                const isCurrent = s.index === currentStroke;
                                return (
                                    <text
                                        key={`num-${s.id}`}
                                        x={s.numberPos.x}
                                        y={s.numberPos.y}
                                        fill={isCurrent ? '#a83d32' : '#52606d'}
                                        fontSize="7.5"
                                        fontWeight={isCurrent ? '700' : '600'}
                                        fontFamily="sans-serif"
                                    >
                                        {s.index}
                                    </text>
                                );
                            })}
                        </g>
                    )}
                </svg>

                {loading && (
                    <div className="kanji-stage-overlay" role="status">
                        <span>{t('Đang tải KanjiVG…', 'Loading KanjiVG…')}</span>
                    </div>
                )}

                <div className="kanji-stage-badge">
                    <span>
                        {t('Nét', 'Stroke')} <strong>{Math.min(currentStroke, totalStrokes)}</strong> /{' '}
                        {totalStrokes}
                    </span>
                    <button
                        type="button"
                        className={`kanji-toggle-num-btn ${showNumbers ? 'active' : ''}`}
                        onClick={() => setShowNumbers(v => !v)}
                        aria-pressed={showNumbers}
                        title={t('Ẩn/hiện số thứ tự nét', 'Show/Hide Stroke Numbers')}
                    >
                        {showNumbers ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{t('Số nét', 'Numbers')}</span>
                    </button>
                </div>
            </div>

            {/* Playback & Speed Controls */}
            <div className="kanji-player-controls">
                <div className="kanji-transport-btns" role="group" aria-label={t('Điều khiển nét viết', 'Stroke playback controls')}>
                    <button
                        type="button"
                        className="kanji-ctrl-btn primary"
                        onClick={handlePlayPause}
                        disabled={totalStrokes === 0}
                        aria-label={isPlaying ? t('Tạm dừng', 'Pause') : t('Phát tự động', 'Play')}
                    >
                        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                        <span>{isPlaying ? t('Tạm dừng', 'Pause') : t('Phát', 'Play')}</span>
                    </button>

                    <button
                        type="button"
                        className="kanji-ctrl-btn"
                        onClick={handleReplay}
                        disabled={totalStrokes === 0}
                        aria-label={t('Phát lại từ đầu', 'Replay')}
                        title={t('Phát lại từ nét 1', 'Replay from stroke 1')}
                    >
                        <RotateCcw size={15} />
                        <span>{t('Phát lại', 'Replay')}</span>
                    </button>

                    <button
                        type="button"
                        className="kanji-ctrl-btn icon-only"
                        onClick={handlePrevStroke}
                        disabled={totalStrokes === 0 || currentStroke <= 1}
                        aria-label={t('Nét trước', 'Previous Stroke')}
                        title={t('Nét trước', 'Previous Stroke')}
                    >
                        <SkipBack size={15} />
                    </button>

                    <button
                        type="button"
                        className="kanji-ctrl-btn icon-only"
                        onClick={handleNextStroke}
                        disabled={totalStrokes === 0 || currentStroke >= totalStrokes}
                        aria-label={t('Nét tiếp theo', 'Next Stroke')}
                        title={t('Nét tiếp theo', 'Next Stroke')}
                    >
                        <SkipForward size={15} />
                    </button>
                </div>

                <div className="kanji-speed-selector" role="group" aria-label={t('Tốc độ vẽ', 'Playback speed')}>
                    {([0.5, 1, 2] as PlaybackSpeed[]).map(s => (
                        <button
                            key={s}
                            type="button"
                            className={`kanji-speed-btn ${speed === s ? 'active' : ''}`}
                            aria-pressed={speed === s}
                            onClick={() => setSpeed(s)}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>

            {/* Interactive Stroke Scrubber Pills */}
            {totalStrokes > 1 && (
                <div className="kanji-stroke-steps" role="group" aria-label={t('Chọn từng nét', 'Jump to stroke')}>
                    {strokes.map(s => (
                        <button
                            key={`step-${s.id}`}
                            type="button"
                            className={`kanji-step-pill ${
                                s.index === currentStroke
                                    ? 'current'
                                    : s.index < currentStroke
                                      ? 'done'
                                      : ''
                            }`}
                            onClick={() => {
                                clearTimers();
                                setIsPlaying(false);
                                setAnimatingStroke(null);
                                setCurrentStroke(s.index);
                            }}
                            aria-label={`${t('Nét', 'Stroke')} ${s.index}`}
                        >
                            {s.index}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
