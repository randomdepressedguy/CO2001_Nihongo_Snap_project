'use client';
/* eslint-disable @next/next/no-img-element -- Local camera/upload preview data URLs. */

import { useEffect, useRef, useState } from 'react';
import {
    AlignJustify,
    Columns3,
    Camera,
    RefreshCw,
    ScanText,
    Sparkles,
    Upload,
} from 'lucide-react';
import {
    type OcrOrientation,
    type OcrProgressUpdate,
    type OcrRecognitionResult,
    createSampleJapaneseOcrImage,
    recognizeJapaneseImage,
} from '@/lib/study/ocrService';
import { Modal } from './shared';
import { useStudy } from './context';
import { InteractiveOcrViewer } from './InteractiveOcrViewer';
import { SnapToDeckBuilder } from './SnapToDeckBuilder';

export type SnapOcrModalProps = {
    onClose: () => void;
    onSelectWord?: (word: string) => void;
};

export function SnapOcrModal({ onClose, onSelectWord }: SnapOcrModalProps) {
    const { t } = useStudy();
    const [orientation, setOrientation] = useState<OcrOrientation>('horizontal');
    const [cameraActive, setCameraActive] = useState(false);
    const [facing, setFacing] = useState<'environment' | 'user'>('environment');
    const [photo, setPhoto] = useState('');
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState<OcrProgressUpdate>({ status: '', progress: 0 });
    const [ocrResult, setOcrResult] = useState<OcrRecognitionResult | null>(null);
    const [error, setError] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function stopCamera() {
        streamRef.current?.getTracks().forEach(tr => tr.stop());
        streamRef.current = null;
        setCameraActive(false);
    }

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach(tr => tr.stop());
        };
    }, []);

    async function startCamera(nextFacing = facing) {
        setError('');
        stopCamera();
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    t(
                        'Camera cần trình duyệt hỗ trợ và HTTPS. Bạn có thể tải ảnh lên.',
                        'Camera requires a supported browser and HTTPS. Please upload an image instead.'
                    )
                );
            }
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: nextFacing, width: { ideal: 1280 } },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();
            }
            setPhoto('');
            setOcrResult(null);
            setCameraActive(true);
        } catch (err) {
            setError(
                (err as Error).name === 'NotAllowedError'
                    ? t(
                          'Quyền camera bị từ chối. Hãy cấp quyền hoặc tải ảnh lên.',
                          'Camera access denied. Allow camera permissions or upload an image.'
                      )
                    : (err as Error).message
            );
        }
    }

    async function runOcr(imageDataUrl: string, mode = orientation) {
        if (!imageDataUrl) return;
        setScanning(true);
        setError('');
        setProgress({
            status: t('Đang tiền xử lý ảnh…', 'Preprocessing image…'),
            progress: 5,
        });
        try {
            const res = await recognizeJapaneseImage(imageDataUrl, {
                orientation: mode,
                onProgress: update => setProgress(update),
            });
            setOcrResult(res);
            if (!res.text && res.words.length === 0) {
                setError(
                    t(
                        'Không tìm thấy chữ tiếng Nhật rõ ràng. Hãy thử ảnh rõ nét hơn hoặc đổi chế độ Ngang/Dọc.',
                        'No clear Japanese text detected. Try a sharper image or switch Horizontal/Vertical mode.'
                    )
                );
            }
        } catch (err) {
            setError((err as Error).message || t('Lỗi khi nhận diện OCR.', 'OCR recognition failed.'));
        } finally {
            setScanning(false);
        }
    }

    function handleFileUpload(file?: File) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError(t('Chọn ảnh JPG, PNG hoặc WebP.', 'Choose a JPG, PNG, or WebP image.'));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError(t('Ảnh tối đa 10 MB.', 'Maximum image size is 10 MB.'));
            return;
        }
        stopCamera();
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || '');
            setPhoto(dataUrl);
            setOcrResult(null);
            void runOcr(dataUrl, orientation);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function captureFrame() {
        const v = videoRef.current;
        if (!v?.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        canvas.getContext('2d')!.drawImage(v, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        stopCamera();
        setPhoto(dataUrl);
        setOcrResult(null);
        void runOcr(dataUrl, orientation);
    }

    function loadSampleImage(mode: OcrOrientation) {
        stopCamera();
        setOrientation(mode);
        const sample = createSampleJapaneseOcrImage(mode);
        setPhoto(sample);
        setOcrResult(null);
        void runOcr(sample, mode);
    }

    return (
        <Modal
            title={t('Snap / OCR · Quét chữ tiếng Nhật tương tác', 'Snap / OCR · Interactive Japanese Scanner')}
            close={() => {
                stopCamera();
                onClose();
            }}
            wide
        >
            <div className="snap-ocr-modal-body">
                {/* Orientation Toggle: Horizontal (横書き) vs Vertical (縦書き - Manga/Sách) */}
                <div className="ocr-orientation-bar">
                    <span className="ocr-orientation-label">
                        {t('Hướng văn bản:', 'Text direction:')}
                    </span>
                    <div className="ocr-orientation-toggle" role="group" aria-label={t('Chọn hướng chữ Nhật', 'Japanese text orientation')}>
                        <button
                            type="button"
                            className={orientation === 'horizontal' ? 'active' : ''}
                            onClick={() => {
                                setOrientation('horizontal');
                                if (photo && !scanning) void runOcr(photo, 'horizontal');
                            }}
                        >
                            <AlignJustify size={16} />
                            <span>{t('Chữ ngang (横書き)', 'Horizontal (横書き)')}</span>
                        </button>
                        <button
                            type="button"
                            className={orientation === 'vertical' ? 'active' : ''}
                            onClick={() => {
                                setOrientation('vertical');
                                if (photo && !scanning) void runOcr(photo, 'vertical');
                            }}
                        >
                            <Columns3 size={16} />
                            <span>{t('Chữ dọc (縦書き - Manga/Sách)', 'Vertical (縦書き - Manga/Book)')}</span>
                        </button>
                    </div>
                </div>

                {/* Capture / Drag-and-drop Upload Area */}
                {!ocrResult && (
                    <div
                        className="capture-area modal-capture-area"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            if (!scanning) handleFileUpload(e.dataTransfer.files[0]);
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={cameraActive ? 'camera-video' : 'camera-video hidden'}
                            aria-label="Live camera preview"
                        />
                        {photo && !cameraActive ? (
                            <img
                                className="photo-preview"
                                src={photo}
                                alt={t('Ảnh đã chọn để quét OCR', 'Selected image for OCR')}
                            />
                        ) : (
                            !cameraActive && (
                                <div className="capture-empty">
                                    <div className="viewfinder">
                                        <ScanText size={34} />
                                    </div>
                                    <h3>
                                        {t(
                                            'Chụp ảnh hoặc kéo thả trang sách / Manga vào đây',
                                            'Capture a photo or drag & drop a Japanese page / Manga here'
                                        )}
                                    </h3>
                                    <p>
                                        {t(
                                            'Hỗ trợ nhận diện chữ ngang (横書き) và chữ dọc (縦書き) hoàn toàn miễn phí với Tesseract.js.',
                                            'Supports horizontal (横書き) and vertical (縦書き) Japanese OCR powered by Tesseract.js.'
                                        )}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Real-time 0% - 100% Progress Bar */}
                {scanning && (
                    <div className="ocr-progress-box" role="status" aria-live="polite">
                        <div className="ocr-progress-head">
                            <span>{progress.status || t('Đang nhận diện tiếng Nhật…', 'Recognizing Japanese…')}</span>
                            <strong>{progress.progress}%</strong>
                        </div>
                        <div className="ocr-progress-track">
                            <span style={{ width: `${progress.progress}%` }} />
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="capture-actions">
                    {cameraActive ? (
                        <>
                            <button type="button" className="btn" onClick={captureFrame}>
                                <Camera size={17} />
                                {t('Chụp & Quét OCR', 'Capture & Scan OCR')}
                            </button>
                            <button
                                type="button"
                                className="icon-btn bordered"
                                aria-label="Switch camera"
                                onClick={() => {
                                    const next = facing === 'user' ? 'environment' : 'user';
                                    setFacing(next);
                                    void startCamera(next);
                                }}
                            >
                                <RefreshCw size={18} />
                            </button>
                            <button type="button" className="text-btn" onClick={stopCamera}>
                                {t('Tắt camera', 'Stop camera')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn"
                                disabled={scanning}
                                onClick={() => void startCamera()}
                            >
                                <Camera size={17} />
                                {t('Mở camera', 'Open camera')}
                            </button>
                            <button
                                type="button"
                                className="btn secondary"
                                disabled={scanning}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={17} />
                                {t('Tải ảnh lên', 'Upload image')}
                            </button>
                            <button
                                type="button"
                                className="btn secondary"
                                disabled={scanning}
                                onClick={() => loadSampleImage(orientation)}
                            >
                                <Sparkles size={16} />
                                {orientation === 'vertical'
                                    ? t('Thử mẫu chữ dọc (縦書き)', 'Try vertical sample (縦書き)')
                                    : t('Thử mẫu chữ ngang (横書き)', 'Try horizontal sample (横書き)')}
                            </button>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={e => handleFileUpload(e.target.files?.[0])}
                    />
                </div>

                {error && (
                    <div className="feedback wrong" role="alert">
                        {error}
                    </div>
                )}

                {ocrResult && (
                    <>
                        <InteractiveOcrViewer
                            imageSrc={photo || ocrResult.processedImageUrl}
                            result={ocrResult}
                            onSelectWordForSearch={
                                onSelectWord
                                    ? word => {
                                          onSelectWord(word);
                                          onClose();
                                      }
                                    : undefined
                            }
                        />
                        <SnapToDeckBuilder result={ocrResult} />
                    </>
                )}
            </div>
        </Modal>
    );
}
