'use client';
import { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, HelpCircle, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import {
    DEFAULT_TRACING_TOLERANCE,
    type KanjiStrokeData,
    validateTracingStroke,
} from '@/src/services/kanjiService';
import { useStudy } from './context';

export function KanjiTracingCanvas({
    strokeData,
}: {
    strokeData: KanjiStrokeData | null;
}) {
    const { t } = useStudy();
    const strokes = strokeData?.strokes ?? [];
    const totalStrokes = strokes.length;

    // 0-based index of the stroke currently being practiced (0 .. totalStrokes)
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activePoints, setActivePoints] = useState<{ x: number; y: number }[]>([]);
    const [feedback, setFeedback] = useState<{
        status: 'idle' | 'correct' | 'wrong';
        message: string;
        wrongPoints?: { x: number; y: number }[];
    }>(() => ({
        status: 'idle',
        message: t(
            'Đặt bút từ chấm tròn đỏ và kéo theo nét hướng dẫn.',
            'Start at the red dot and trace along the highlighted stroke.'
        ),
    }));
    const [showHint, setShowHint] = useState<boolean>(true);
    const [attempts, setAttempts] = useState<number>(0);
    const [strokeScores, setStrokeScores] = useState<number[]>([]);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const targetPathRef = useRef<SVGPathElement | null>(null);
    const drawingRef = useRef<boolean>(false);
    const pointsRef = useRef<{ x: number; y: number }[]>([]);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    const completed = totalStrokes > 0 && activeIndex >= totalStrokes;
    const currentTarget = !completed ? strokes[activeIndex] : undefined;

    const toViewBoxPoint = (clientX: number, clientY: number): { x: number; y: number } => {
        const svg = svgRef.current;
        if (!svg) return { x: 54.5, y: 54.5 };
        const rect = svg.getBoundingClientRect();
        const x =
            rect.width > 0
                ? Math.max(0, Math.min(109, ((clientX - rect.left) / rect.width) * 109))
                : 54.5;
        const y =
            rect.height > 0
                ? Math.max(0, Math.min(109, ((clientY - rect.top) / rect.height) * 109))
                : 54.5;
        return { x, y };
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (completed || !currentTarget) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignore pointer capture errors in synthetic events
        }
        const pt = toViewBoxPoint(e.clientX, e.clientY);
        drawingRef.current = true;
        pointsRef.current = [pt];
        setActivePoints([pt]);
        if (feedback.status === 'wrong') {
            setFeedback({ status: 'idle', message: '' });
        }
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!drawingRef.current || completed) return;
        e.preventDefault();
        const pt = toViewBoxPoint(e.clientX, e.clientY);
        const last = pointsRef.current[pointsRef.current.length - 1];
        if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 1.2) return;
        pointsRef.current = [...pointsRef.current, pt];
        setActivePoints(pointsRef.current);
    };

    const finishStroke = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        const drawn = pointsRef.current;
        pointsRef.current = [];
        setActivePoints([]);

        if (!currentTarget || drawn.length < 2) return;

        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        setAttempts(prev => prev + 1);

        const validation = validateTracingStroke(drawn, currentTarget, {
            tolerance: DEFAULT_TRACING_TOLERANCE,
            svgPathElement: targetPathRef.current,
        });

        if (validation.valid) {
            const nextScores = [...strokeScores, validation.accuracy];
            setStrokeScores(nextScores);
            const nextIndex = activeIndex + 1;
            setActiveIndex(nextIndex);
            setFeedback({
                status: 'correct',
                message:
                    nextIndex >= totalStrokes
                        ? t(
                              'Tuyệt vời! Bạn đã hoàn thành tất cả các nét chuẩn xác.',
                              'Awesome! You traced every stroke accurately.'
                          )
                        : t(
                              `Chính xác nét ${activeIndex + 1}/${totalStrokes}! Tiếp tục nét ${nextIndex + 1}.`,
                              `Stroke ${activeIndex + 1}/${totalStrokes} correct! Now trace stroke ${nextIndex + 1}.`
                          ),
            });
        } else {
            const errMessage =
                validation.reason === 'reverse_direction'
                    ? t(
                          `Ngược chiều nét ${activeIndex + 1}! Hãy bắt đầu từ chấm tròn đỏ.`,
                          `Reverse direction on stroke ${activeIndex + 1}! Start from the red dot.`
                      )
                    : validation.reason === 'too_short'
                      ? t(
                            'Nét vẽ quá ngắn. Hãy kéo hết chiều dài nét hướng dẫn.',
                            'Stroke too short. Trace all the way to the end of the guide.'
                        )
                      : t(
                            `Sai vị trí hoặc sai thứ tự nét ${activeIndex + 1}. Hãy viết theo nét đứt màu đỏ.`,
                            `Wrong stroke order or position for stroke ${activeIndex + 1}. Follow the highlighted guide.`
                        );

            setFeedback({
                status: 'wrong',
                message: errMessage,
                wrongPoints: drawn,
            });

            feedbackTimerRef.current = setTimeout(() => {
                setFeedback(prev =>
                    prev.status === 'wrong' ? { ...prev, wrongPoints: undefined } : prev
                );
            }, 650);
        }
    };

    const handleReset = () => {
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        drawingRef.current = false;
        pointsRef.current = [];
        setActiveIndex(0);
        setActivePoints([]);
        setAttempts(0);
        setStrokeScores([]);
        setFeedback({
            status: 'idle',
            message: t(
                'Đã đặt lại bảng luyện viết. Bắt đầu từ nét số 1.',
                'Reset tracing pad. Start from stroke 1.'
            ),
        });
    };

    const pointsToPolyline = (pts: { x: number; y: number }[]) =>
        pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    const averageAccuracy =
        strokeScores.length > 0
            ? Math.round(
                  (strokeScores.reduce((a, b) => a + b, 0) / strokeScores.length) *
                      Math.min(1, totalStrokes / Math.max(totalStrokes, attempts))
              )
            : 100;

    return (
        <div className={`kanji-tracing-canvas ${feedback.status === 'wrong' && feedback.wrongPoints ? 'shake-error' : ''}`}>
            <div className="kanji-svg-stage-wrap tracing-mode">
                <svg
                    ref={svgRef}
                    viewBox="0 0 109 109"
                    className="kanji-svg-stage interactive-surface"
                    role="application"
                    aria-label={
                        strokeData
                            ? t(
                                  `Bảng luyện viết từng nét chữ ${strokeData.kanji}`,
                                  `Interactive stroke tracing canvas for ${strokeData.kanji}`
                              )
                            : t('Bảng luyện viết chữ Kanji', 'Kanji tracing canvas')
                    }
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishStroke}
                    onPointerCancel={finishStroke}
                >
                    {/* Mizugaki Crosshair Grid */}
                    <g className="mizugaki-guides" aria-hidden="true">
                        <rect
                            x="2"
                            y="2"
                            width="105"
                            height="105"
                            rx="4"
                            fill="#fffdf7"
                            stroke={
                                feedback.status === 'wrong' && feedback.wrongPoints
                                    ? '#dc2626'
                                    : completed
                                      ? '#16a34a'
                                      : '#d6ccb5'
                            }
                            strokeWidth="1.4"
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

                    {/* All strokes rendered in faint gray (#e5e7eb) */}
                    <g
                        className="kanji-tracing-ghosts"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {strokes.map(s => (
                            <path key={`trace-ghost-${s.id}`} d={s.d} />
                        ))}
                    </g>

                    {/* Completed strokes filled smoothly in green */}
                    <g
                        className="kanji-tracing-completed"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="4.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {strokes.slice(0, activeIndex).map(s => (
                            <path
                                key={`trace-done-${s.id}`}
                                d={s.d}
                                className="kanji-traced-green-path"
                            />
                        ))}
                    </g>

                    {/* Current target stroke guide + hidden/live SVGPathElement for getPointAtLength(0) & getPointAtLength(totalLength) */}
                    {currentTarget && (
                        <g className="kanji-target-guide">
                            <path
                                ref={targetPathRef}
                                d={currentTarget.d}
                                fill="none"
                                stroke={showHint ? '#d97757' : 'transparent'}
                                strokeWidth="3.6"
                                strokeDasharray="3.5 3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Start point indicator */}
                            <circle
                                cx={currentTarget.startPoint.x}
                                cy={currentTarget.startPoint.y}
                                r="3.4"
                                fill="#a83d32"
                                stroke="#fffdf7"
                                strokeWidth="1"
                            />
                            <text
                                x={currentTarget.numberPos.x}
                                y={currentTarget.numberPos.y}
                                fill="#a83d32"
                                fontSize="7.5"
                                fontWeight="700"
                                fontFamily="sans-serif"
                            >
                                {currentTarget.index}
                            </text>
                        </g>
                    )}

                    {/* User's live pointer trail while drawing */}
                    {activePoints.length > 1 && (
                        <polyline
                            points={pointsToPolyline(activePoints)}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="4.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Red flash feedback trail when wrong direction or wrong order */}
                    {feedback.wrongPoints && feedback.wrongPoints.length > 1 && (
                        <polyline
                            points={pointsToPolyline(feedback.wrongPoints)}
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="4.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </svg>

                <div className="kanji-stage-badge">
                    <span>
                        {completed
                            ? t(`Hoàn thành ${totalStrokes}/${totalStrokes} nét`, `Completed ${totalStrokes}/${totalStrokes} strokes`)
                            : t(
                                  `Đang viết nét ${activeIndex + 1} / ${totalStrokes}`,
                                  `Tracing stroke ${activeIndex + 1} / ${totalStrokes}`
                              )}
                    </span>
                    <button
                        type="button"
                        className={`kanji-toggle-num-btn ${showHint ? 'active' : ''}`}
                        onClick={() => setShowHint(v => !v)}
                        aria-pressed={showHint}
                        title={t('Bật/tắt nét gợi ý', 'Toggle stroke guide')}
                    >
                        <HelpCircle size={13} />
                        <span>{t('Gợi ý', 'Guide')}</span>
                    </button>
                </div>
            </div>

            {/* Real-time Feedback Banner */}
            <div
                className={`kanji-tracing-feedback ${feedback.status}`}
                role="status"
                aria-live="polite"
            >
                {feedback.status === 'correct' && <CheckCircle2 size={16} />}
                {feedback.status === 'wrong' && <XCircle size={16} />}
                {feedback.status === 'idle' && <Sparkles size={16} />}
                <span>
                    {feedback.message ||
                        t(
                            'Kéo theo nét đứt từ chấm tròn đỏ.',
                            'Trace along the dashed stroke starting from the red dot.'
                        )}
                </span>
            </div>

            {/* Completion & Accuracy Badge when all strokes are finished */}
            {completed && (
                <div className="kanji-completion-badge" role="region" aria-label={t('Kết quả luyện viết', 'Tracing completion badge')}>
                    <div className="kanji-completion-info">
                        <Award size={20} />
                        <div>
                            <strong>
                                {t('Hoàn thành luyện viết!', 'Tracing Complete!')} · {averageAccuracy}%{' '}
                                {t('chính xác', 'accuracy')}
                            </strong>
                            <small>
                                {t(
                                    `${totalStrokes} nét chuẩn KanjiVG · ${attempts} lượt vẽ`,
                                    `${totalStrokes} KanjiVG strokes · ${attempts} attempts`
                                )}
                            </small>
                        </div>
                    </div>
                    <button type="button" className="btn secondary compact" onClick={handleReset}>
                        <RotateCcw size={14} />
                        <span>{t('Viết lại', 'Practice again')}</span>
                    </button>
                </div>
            )}

            {/* Controls when still in progress */}
            {!completed && (
                <div className="kanji-tracing-actions">
                    <button
                        type="button"
                        className="kanji-ctrl-btn"
                        onClick={handleReset}
                        disabled={activeIndex === 0 && attempts === 0}
                    >
                        <RotateCcw size={14} />
                        <span>{t('Viết lại từ đầu', 'Reset practice')}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
