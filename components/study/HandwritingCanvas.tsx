'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Delete, Eraser, PenTool, Undo2, X } from 'lucide-react';
import {
    type HandwritingStroke,
    recognizeHandwriting,
    MAX_HANDWRITING_CANDIDATES,
} from '@/lib/study/handwritingService';
import { CandidateBar } from './CandidateBar';
import { useStudy } from './context';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 230;
const RECOGNITION_DEBOUNCE_MS = 150;

export function HandwritingCanvas({
    value,
    onChange,
    onClose,
}: {
    value: string;
    onChange: (nextValue: string) => void;
    onClose: () => void;
}) {
    const { t } = useStudy();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [strokes, setStrokes] = useState<HandwritingStroke[]>([]);
    const [candidates, setCandidates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState<'google-ime' | 'fallback'>('google-ime');

    const activeStrokeRef = useRef<{
        drawing: boolean;
        originTime: number;
        xs: number[];
        ys: number[];
        ts: number[];
    }>({
        drawing: false,
        originTime: 0,
        xs: [],
        ys: [],
        ts: [],
    });

    const lastTouchTimeRef = useRef(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const recognitionVersion = useRef(0);

    const drawCanvas = useCallback((completedStrokes: HandwritingStroke[], current?: { xs: number[]; ys: number[] }) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
        const targetW = Math.round(CANVAS_WIDTH * dpr);
        const targetH = Math.round(CANVAS_HEIGHT * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        // Warm Japanese paper background
        ctx.fillStyle = '#fffdf7';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Subtle dashed diagonal & crosshair guide grid for Kanji radical balance
        ctx.save();
        ctx.strokeStyle = '#dfd7c4';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // Diagonal guides
        ctx.beginPath();
        ctx.moveTo(16, 16);
        ctx.lineTo(CANVAS_WIDTH - 16, CANVAS_HEIGHT - 16);
        ctx.moveTo(CANVAS_WIDTH - 16, 16);
        ctx.lineTo(16, CANVAS_HEIGHT - 16);
        ctx.stroke();

        // Center horizontal & vertical crosshair
        ctx.strokeStyle = '#c8beaa';
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, 10);
        ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
        ctx.moveTo(10, CANVAS_HEIGHT / 2);
        ctx.lineTo(CANVAS_WIDTH - 10, CANVAS_HEIGHT / 2);
        ctx.stroke();

        // Inner practice frame (Genkouyoushi box)
        ctx.setLineDash([]);
        ctx.strokeStyle = '#e5decb';
        ctx.strokeRect(10.5, 10.5, CANVAS_WIDTH - 21, CANVAS_HEIGHT - 21);
        ctx.restore();

        // Draw ink strokes
        const renderStrokePoints = (xs: number[], ys: number[], isCurrent: boolean) => {
            if (xs.length === 0) return;
            ctx.save();
            ctx.strokeStyle = isCurrent ? '#a83d32' : '#1f2d37';
            ctx.fillStyle = isCurrent ? '#a83d32' : '#1f2d37';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (xs.length === 1) {
                ctx.beginPath();
                ctx.arc(xs[0], ys[0], 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                return;
            }

            ctx.beginPath();
            ctx.moveTo(xs[0], ys[0]);
            for (let i = 1; i < xs.length - 1; i++) {
                const midX = (xs[i] + xs[i + 1]) / 2;
                const midY = (ys[i] + ys[i + 1]) / 2;
                ctx.quadraticCurveTo(xs[i], ys[i], midX, midY);
            }
            ctx.lineTo(xs[xs.length - 1], ys[ys.length - 1]);
            ctx.stroke();
            ctx.restore();
        };

        for (const stroke of completedStrokes) {
            renderStrokePoints(stroke[0], stroke[1], false);
        }
        if (current && current.xs.length > 0) {
            renderStrokePoints(current.xs, current.ys, true);
        }

        ctx.restore();
    }, []);

    // Re-render whenever completed strokes change
    useEffect(() => {
        drawCanvas(strokes);
    }, [strokes, drawCanvas]);

    // Cleanup pending timers and requests on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    const invalidateRecognition = () => {
        recognitionVersion.current++;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        setCandidates([]);
        setLoading(false);
    };

    const scheduleRecognition = (nextStrokes: HandwritingStroke[]) => {
        invalidateRecognition();
        const version = recognitionVersion.current;

        if (nextStrokes.length === 0) {
            setCandidates([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const controller = new AbortController();
        abortRef.current = controller;

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await recognizeHandwriting(nextStrokes, {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    maxResults: MAX_HANDWRITING_CANDIDATES,
                    signal: controller.signal,
                });
                if (!controller.signal.aborted && version === recognitionVersion.current) {
                    setCandidates(res.candidates);
                    setSource(res.source);
                    setLoading(false);
                }
            } catch (err) {
                if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
                    return;
                }
                if (!controller.signal.aborted && version === recognitionVersion.current) {
                    setLoading(false);
                }
            }
        }, RECOGNITION_DEBOUNCE_MS);
    };

    // Prevent page scrolling on mobile touch move inside the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const preventScroll = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
        };
        canvas.addEventListener('touchstart', preventScroll, { passive: false });
        canvas.addEventListener('touchmove', preventScroll, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', preventScroll);
            canvas.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    const getCanvasCoords = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width > 0 ? CANVAS_WIDTH / rect.width : 1;
        const scaleY = rect.height > 0 ? CANVAS_HEIGHT / rect.height : 1;
        const x = Math.max(0, Math.min(CANVAS_WIDTH, Math.round((clientX - rect.left) * scaleX)));
        const y = Math.max(0, Math.min(CANVAS_HEIGHT, Math.round((clientY - rect.top) * scaleY)));
        return { x, y };
    };

    const beginStroke = (clientX: number, clientY: number) => {
        invalidateRecognition();
        setLoading(true);
        const now = Date.now();
        if (strokes.length === 0 && !activeStrokeRef.current.originTime) {
            activeStrokeRef.current.originTime = now;
        }
        const origin = activeStrokeRef.current.originTime || now;
        const { x, y } = getCanvasCoords(clientX, clientY);
        activeStrokeRef.current = {
            drawing: true,
            originTime: origin,
            xs: [x],
            ys: [y],
            ts: [Math.max(0, now - origin)],
        };
        drawCanvas(strokes, { xs: [x], ys: [y] });
    };

    const moveStroke = (clientX: number, clientY: number) => {
        const state = activeStrokeRef.current;
        if (!state.drawing) return;
        const { x, y } = getCanvasCoords(clientX, clientY);
        const lastX = state.xs[state.xs.length - 1];
        const lastY = state.ys[state.ys.length - 1];
        if (lastX === x && lastY === y) return;
        state.xs.push(x);
        state.ys.push(y);
        state.ts.push(Math.max(0, Date.now() - state.originTime));
        drawCanvas(strokes, { xs: state.xs, ys: state.ys });
    };

    const endStroke = () => {
        const state = activeStrokeRef.current;
        if (!state.drawing) return;
        state.drawing = false;
        if (state.xs.length === 0) return;

        // Ensure single-tap dot strokes have at least two coordinate points for Google IME
        const xs = state.xs.length === 1 ? [state.xs[0], state.xs[0] + 1] : [...state.xs];
        const ys = state.ys.length === 1 ? [state.ys[0], state.ys[0] + 1] : [...state.ys];
        const ts =
            state.ts.length === 1
                ? [state.ts[0], state.ts[0] + 16]
                : [...state.ts];

        const nextStroke: HandwritingStroke = [xs, ys, ts];
        const nextStrokes = [...strokes, nextStroke];
        setStrokes(nextStrokes);
        scheduleRecognition(nextStrokes);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (Date.now() - lastTouchTimeRef.current < 500) return;
        if (e.button !== 0) return;
        beginStroke(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (Date.now() - lastTouchTimeRef.current < 500) return;
        moveStroke(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        if (Date.now() - lastTouchTimeRef.current < 500) return;
        endStroke();
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        lastTouchTimeRef.current = Date.now();
        const touch = e.touches[0];
        if (!touch) return;
        beginStroke(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        lastTouchTimeRef.current = Date.now();
        const touch = e.touches[0];
        if (!touch) return;
        moveStroke(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        lastTouchTimeRef.current = Date.now();
        endStroke();
    };

    const handleUndo = () => {
        const next = strokes.slice(0, -1);
        if (next.length === 0) {
            activeStrokeRef.current.originTime = 0;
        }
        setStrokes(next);
        scheduleRecognition(next);
    };

    const handleClear = () => {
        activeStrokeRef.current = {
            drawing: false,
            originTime: 0,
            xs: [],
            ys: [],
            ts: [],
        };
        setStrokes([]);
        scheduleRecognition([]);
    };

    const handleBackspace = () => {
        if (!value) return;
        const chars = Array.from(value);
        chars.pop();
        onChange(chars.join(''));
    };

    const handleSelectCandidate = (char: string) => {
        if (loading || activeStrokeRef.current.drawing || !candidates.includes(char)) return;
        onChange(value + char);
        handleClear();
    };

    return (
        <div
            className="handwriting-pad"
            role="dialog"
            aria-label={t('Bảng vẽ chữ Nhật tìm kiếm', 'Japanese handwriting search pad')}
            onClick={e => e.stopPropagation()}
        >
            <div className="handwriting-pad-header">
                <div className="handwriting-pad-title">
                    <PenTool size={15} aria-hidden="true" />
                    <span>{t('Viết tay Kanji / Kana', 'Handwriting Search')}</span>
                    <small className="handwriting-stroke-count">
                        {strokes.length > 0
                            ? t(`${strokes.length} nét`, `${strokes.length} stroke${strokes.length > 1 ? 's' : ''}`)
                            : t('Mazii-style', 'Mazii-style')}
                    </small>
                </div>
                <button
                    type="button"
                    className="icon-btn handwriting-close-btn"
                    onClick={onClose}
                    aria-label={t('Đóng bảng vẽ', 'Close handwriting pad')}
                    title={t('Đóng bảng vẽ', 'Close')}
                >
                    <X size={17} />
                </button>
            </div>

            <CandidateBar
                candidates={candidates}
                loading={loading}
                hasStrokes={strokes.length > 0}
                source={source}
                onSelect={handleSelectCandidate}
                t={t}
            />

            <div className="handwriting-canvas-wrap">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="handwriting-canvas-surface"
                    aria-label={t('Khung vẽ chữ tiếng Nhật', 'Japanese character drawing canvas')}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                />
                {strokes.length === 0 && (
                    <span className="handwriting-watermark jp" lang="ja" aria-hidden="true">
                        字
                    </span>
                )}
            </div>

            <div className="handwriting-controls">
                <button
                    type="button"
                    className="handwriting-ctrl-btn"
                    disabled={strokes.length === 0}
                    onClick={handleUndo}
                    title={t('Hoàn tác nét vừa vẽ', 'Undo last stroke')}
                >
                    <Undo2 size={15} />
                    <span>{t('Hoàn tác', 'Undo')}</span>
                </button>
                <button
                    type="button"
                    className="handwriting-ctrl-btn"
                    disabled={strokes.length === 0}
                    onClick={handleClear}
                    title={t('Xóa toàn bộ nét vẽ', 'Clear canvas')}
                >
                    <Eraser size={15} />
                    <span>{t('Xóa bảng', 'Clear')}</span>
                </button>
                <button
                    type="button"
                    className="handwriting-ctrl-btn"
                    disabled={!value}
                    onClick={handleBackspace}
                    title={t('Xóa ký tự cuối trong ô tìm kiếm', 'Delete last character in search box')}
                >
                    <Delete size={15} />
                    <span>{t('Xóa chữ', 'Backspace')}</span>
                </button>
                <button
                    type="button"
                    className="handwriting-ctrl-btn close-action"
                    onClick={onClose}
                >
                    <span>{t('Đóng', 'Close')}</span>
                </button>
            </div>
            <p className="handwriting-service-note">
                {t('Nét viết được gửi đến Google để nhận diện. Nếu dịch vụ không phản hồi, ứng dụng gợi ý theo số nét trên thiết bị.', 'Strokes are sent to Google for recognition. If the service is unavailable, the app suggests characters locally by stroke count.')}
            </p>
        </div>
    );
}
