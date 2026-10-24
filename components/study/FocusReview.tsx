'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleCheck, Headphones, Keyboard, Layers, ListChecks, RotateCcw, Volume2, X } from 'lucide-react';
import { WORDS } from '@/lib/study/data';
import { type Card, matches, record, schedule } from '@/lib/study/core';
import { dueCards, shuffled } from '@/lib/study/collection';
import { useStudy, useStudyClock } from './context';
import { Modal, PageHead } from './shared';
type Mode = 'flash' | 'choice' | 'typed' | 'listen';
type Result = {
    id: string;
    jp: string;
    correct: boolean;
    grade: number;
};
const modes = [
    ['flash', 'Lật thẻ', 'Flashcards', 'Tự nhớ cách đọc và ý nghĩa.', 'Recall reading and meaning.', Layers],
    ['choice', 'Chọn nghĩa', 'Choose meaning', 'Tìm ý nghĩa phù hợp với từ.', 'Find the matching meaning.', ListChecks],
    ['typed', 'Gõ cách đọc', 'Type the reading', 'Luyện nhớ kana hoặc romaji.', 'Practice kana or romaji.', Keyboard],
    ['listen', 'Nghe & viết', 'Listen & type', 'Nghe từ, rồi nhập cách đọc.', 'Listen, then type the reading.', Headphones],
] as const;
export function Review({ go }: {
    go: (p: string) => void;
}) {
    const { s, set, t, speak, storage } = useStudy();
    const initial = new URLSearchParams(typeof location === 'undefined' ? '' : location.search.slice(1) || location.hash.split('?')[1]);
    const [mode, setMode] = useState<Mode>('flash');
    const [deck, setDeck] = useState(initial.get('deck') || 'all');
    const [free, setFree] = useState(initial.get('free') === '1');
    const [queue, setQueue] = useState<string[] | null>(null);
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [answer, setAnswer] = useState('');
    const [correct, setCorrect] = useState<boolean | null>(null);
    const [results, setResults] = useState<Result[]>([]);
    const [exit, setExit] = useState(false);
    const retried = useRef(new Set<string>());
    const lock = useRef(false);
    const answerInput = useRef<HTMLInputElement>(null);
    const revealButton = useRef<HTMLButtonElement>(null);
    const gradeButton = useRef<HTMLButtonElement>(null);
    const elapsed = useStudyClock();
    const pool = s.cards.filter(c => deck === 'all' || c.deck === deck);
    const due = dueCards(pool);
    const card = queue ? s.cards.find(c => c.id === queue[index]) : undefined;
    const choices = useMemo(() => {
        if (!card)
            return [];
        const meaning = (w: {
            vi: string;
            en: string;
        }) => s.settings.lang === 'vi' ? w.vi || w.en : w.en || w.vi;
        const right = meaning(card);
        return shuffled([right, ...shuffled([...new Set([...s.cards, ...WORDS].map(meaning).filter(x => x && x !== right))]).slice(0, 3)]);
    }, [card?.id, index, s.settings.lang]);
    useEffect(() => { lock.current = false; if (card) {
        if (mode === 'typed' || mode === 'listen')
            answerInput.current?.focus();
        else if (mode === 'flash')
            revealButton.current?.focus();
    } }, [index, queue === null]);
    useEffect(() => { if (revealed)
        gradeButton.current?.focus(); }, [revealed]);
    function start() {
        setQueue((free ? shuffled(pool) : due).slice(0, 30).map(c => c.id));
        setIndex(0);
        setRevealed(false);
        setAnswer('');
        setCorrect(null);
        setResults([]);
        retried.current.clear();
        lock.current = false;
        elapsed();
    }
    function grade(g: number) {
        if (!card || !revealed || lock.current || storage === 'error')
            return;
        if (correct === false && g !== 0)
            return;
        lock.current = true;
        const success = correct ?? g > 0;
        const seconds = elapsed();
        set(x => record({ ...x, cards: free ? x.cards : x.cards.map(c => c.id === card.id ? schedule(c, g) : c) }, seconds, success));
        if (g === 0 && !retried.current.has(card.id)) {
            retried.current.add(card.id);
            setQueue(q => [...q!, card.id]);
        }
        setResults(items => [...items, { id: card.id, jp: card.jp, correct: success, grade: g }]);
        setIndex(i => i + 1);
        setRevealed(false);
        setAnswer('');
        setCorrect(null);
    }
    function submit(value = answer) { if (!card || revealed)
        return; setAnswer(value); setCorrect(mode === 'choice' ? value === t(card.vi || card.en, card.en || card.vi) : matches(value, card)); setRevealed(true); }
    useEffect(() => {
        function keyboard(e: KeyboardEvent) {
            if (exit || (e.target as HTMLElement).closest('dialog,input,textarea,select,[contenteditable=true]') || e.altKey || e.ctrlKey || e.metaKey)
                return;
            if (e.code === 'Space' && card && mode === 'flash' && !revealed) {
                e.preventDefault();
                setRevealed(true);
            }
            if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                grade(Number(e.key) - 1);
            }
        }
        window.addEventListener('keydown', keyboard);
        return () => window.removeEventListener('keydown', keyboard);
    });
    const next = pool.length ? Math.min(...pool.map(c => c.due)) : null;
    const remembered = results.filter(r => r.correct).length;
    const mistakes = [...new Set(results.filter(r => !r.correct || r.grade === 0).map(r => r.jp))];
    return <>
    {queue === null ? <><PageHead eyebrow="復習 · A LITTLE EVERY DAY" title={t('Ôn tập từ vựng', 'A familiar word. A stronger memory.')} desc={t('Chọn bộ thẻ và chế độ luyện tập. Lịch ôn điều chỉnh theo mức độ ghi nhớ.', 'You don’t need to do it all. Just come back, a little at a time.')}/>
      <div className="review-layout"><section className="review-setup"><span className="eyebrow">{t('THIẾT LẬP PHIÊN ÔN', 'YOUR NEXT SESSION')}</span><div className="review-intro"><div className="review-number">{due.length}<span>{t('từ đến hạn', 'words due')}</span></div><div className="review-intro-text"><h2>{due.length ? t('Một chút ôn tập cho hôm nay.', 'A little review for today.') : t('Không còn từ đến hạn.', 'You’re all caught up.')}</h2><p>{due.length ? t('Từ chưa nhớ sẽ được ôn lại sớm hơn.', 'Difficult words return sooner. You set the pace.') : next ? t('Luyện tự do không làm thay đổi lịch ôn hiện tại.', 'Practice freely anytime, keeping your review schedule.') : t('Lưu một vài từ yêu thích để có phiên ôn đầu tiên.', 'Save a few favorite words to begin your first session.')}</p></div></div>
      <h3 className="field-heading">{t('Chọn chế độ ôn tập', 'How would you like to practice?')}</h3><div className="mode-options">{modes.map(([id, vi, en, dvi, den, Icon]) => <button key={id} aria-pressed={mode === id} className={mode === id ? 'selected' : ''} onClick={() => setMode(id)}><span className="mode-icon"><Icon size={22}/></span><strong>{t(vi, en)}</strong><small>{t(dvi, den)}</small><span className="radio-mark">{mode === id && <Check size={11}/>}</span></button>)}</div>
      <div className="grid two session-fields"><label>{t('Chọn bộ thẻ', 'Choose a deck')}<select value={deck} onChange={e => setDeck(e.target.value)}><option value="all">{t('Tất cả bộ thẻ', 'All decks')}</option>{s.decks.map(d => <option key={d}>{d}</option>)}</select></label><label>{t('Kiểu phiên học', 'Session type')}<select value={String(free)} onChange={e => setFree(e.target.value === 'true')}><option value="false">{t('Ôn đến hạn · cập nhật lịch', 'Due review · updates schedule')}</option><option value="true">{t('Luyện tự do · giữ nguyên lịch', 'Free practice · keeps schedule')}</option></select></label></div>
      {mode === 'listen' && <p className="notice">{t('Luyện nghe cần giọng đọc tiếng Nhật trên thiết bị. Có thể đổi chế độ nếu không phát được âm thanh.', 'Listening needs a Japanese voice on your device. Switch modes if audio isn’t available.')}</p>}
      {(free ? pool : due).length ? <button className="btn full session-start" onClick={start}>{t(`Bắt đầu · ${Math.min(30, (free ? pool : due).length)} từ`, `Start session · ${Math.min(30, (free ? pool : due).length)} words`)}<ArrowRight size={18}/></button> : pool.length ? <button className="btn full session-start" onClick={() => setFree(true)}>{t('Chuyển sang luyện tự do', 'Switch to free practice')}<ArrowRight size={18}/></button> : <button className="btn full session-start" onClick={() => go('dictionary')}>{t('Tìm từ đầu tiên', 'Find your first words')}<ArrowRight size={18}/></button>}
      <p className="session-foot">{t('Tối đa 30 từ mỗi phiên. Từ “Học lại” sẽ được thử thêm một lần.', 'Up to 30 words per session. “Again” words get one extra attempt.')}</p></section>
      <aside className="review-guide"><span className="jp" lang="ja">思い出す。</span><h3>{t('Nhớ lại, rồi mới xem.', 'Recall before you reveal.')}</h3><p>{t('Cố gắng nhớ cách đọc và ý nghĩa trước khi xem đáp án. Đây là bước luyện nhớ chủ động.', 'Take a few seconds to recall a word before revealing it. That little effort helps it stay.')}</p><hr /><div><span className="guide-step">01</span><p>{t('Nhìn từ hoặc nghe phát âm.', 'Read the word or listen.')}</p></div><div><span className="guide-step">02</span><p>{t('Tự nhớ, chọn nghĩa hoặc nhập cách đọc.', 'Recall, choose a meaning, or type.')}</p></div><div><span className="guide-step">03</span><p>{t('Xem đáp án và đánh giá độ nhớ.', 'Check the answer and rate recall.')}</p></div><small>{t('Mỗi lượt hoàn thành được lưu ngay. Có thể kết thúc phiên giữa chừng.', 'Completed reviews save immediately. Stop whenever you need.')}</small></aside></div></> : !card ? <section className="session-summary"><div className="completion-art" aria-hidden="true"><span className="jp">よくできました</span><CircleCheck size={48} strokeWidth={1.2}/></div><span className="eyebrow">{t('MỘT CHÚT TIẾN BỘ, MỖI NGÀY', 'A LITTLE BETTER, EVERY DAY')}</span><h1>{t('Kết quả phiên ôn', 'You showed up today.')}</h1><p>{t(`Đã hoàn thành ${results.length} lượt ôn cho ${new Set(results.map(r => r.id)).size} từ.`, `${results.length} completed reviews across ${new Set(results.map(r => r.id)).size} words.`)}</p><div className="summary-line"><span><CheckCheckIcon />{remembered} {t('lượt nhớ đúng', 'correct recalls')}</span><span>{results.length ? Math.round(remembered / results.length * 100) : 0}% {t('chính xác', 'accuracy')}</span></div>{mistakes.length > 0 && <div className="mistake-list"><strong>{t('Những từ cần gặp lại', 'Words to revisit')}</strong><p className="jp" lang="ja">{mistakes.join(' ・ ')}</p></div>}<p className="hint">{free ? t('Đây là phiên tự do. Lịch ôn được giữ nguyên.', 'This was free practice. Review schedules are unchanged.') : t('Lịch ôn đã được cập nhật theo kết quả.', 'Your review schedule reflects each completed answer.')}</p><div className="row centered wrap"><button className="btn" onClick={() => setQueue(null)}>{t('Xong rồi', 'All done')}<Check size={17}/></button><button className="btn secondary" onClick={() => go('notebook')}>{t('Mở sổ tay', 'Open notebook')}<BookOpen size={17}/></button></div></section> : <div className="review-session"><div className="session-top"><button className="text-btn" onClick={() => setExit(true)}><X size={18}/>{t('Kết thúc', 'End session')}</button><span>{t(...(modes.find(m => m[0] === mode)!.slice(1, 3) as [
            string,
            string
        ]))}<span className="separator">/</span>{index + 1} / {queue.length}</span><span className="tag">{free ? t('Tự do', 'Free practice') : t('Đến hạn', 'Due review')}</span></div><div className="progress-track" role="progressbar" aria-label={t('Tiến độ phiên ôn', 'Review progress')} aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={index}><span style={{ width: `${index / queue.length * 100}%` }}/></div>
      <section className="study-card"><header><span className="eyebrow">{card.deck}</span><button className="icon-btn" aria-label={t('Nghe phát âm', 'Listen to pronunciation')} onClick={() => speak(card.jp)}><Volume2 size={21}/></button></header><div className="study-prompt"><span className="question-label">{mode === 'choice' ? t('TỪ NÀY CÓ NGHĨA LÀ GÌ?', 'WHAT DOES THIS WORD MEAN?') : mode === 'typed' ? t('NHẬP CÁCH ĐỌC CỦA TỪ', 'HOW DO YOU READ THIS WORD?') : mode === 'listen' ? t('NGHE VÀ NHẬP CÁCH ĐỌC', 'LISTEN AND TYPE THE READING') : t('NHỚ LẠI CÁCH ĐỌC VÀ Ý NGHĨA', 'DO YOU REMEMBER THIS WORD?')}</span>{mode === 'listen' && !revealed ? <button className="listen-big" aria-label={t('Phát từ tiếng Nhật', 'Play Japanese word')} onClick={() => speak(card.jp)}><Volume2 size={42}/><span>{t('Chạm để nghe', 'Tap to listen')}</span></button> : <h1 className="jp review-jp" lang="ja">{card.jp}</h1>}</div>
      {!revealed && mode === 'flash' && <div className="reveal-area"><p>{t('Thử nhớ cách đọc và ý nghĩa, rồi xem đáp án.', 'Recall the reading and meaning, then reveal.')}</p><button ref={revealButton} className="btn secondary" onClick={() => setRevealed(true)}>{t('Xem đáp án', 'Reveal answer')}<span className="key-hint">Space</span></button></div>}
      {!revealed && mode === 'choice' && <div className="quiz-options">{choices.map((choice, i) => <button key={choice} onClick={() => submit(choice)}><span>{String.fromCharCode(65 + i)}</span>{choice}</button>)}</div>}
      {!revealed && (mode === 'typed' || mode === 'listen') && <form className="answer-form" onSubmit={e => { e.preventDefault(); submit(); }}><label htmlFor="review-answer">{t('Kana hoặc romaji', 'Kana or romaji')}</label><div className="row"><input ref={answerInput} id="review-answer" autoComplete="off" spellCheck={false} value={answer} onChange={e => setAnswer(e.target.value)} placeholder={t('Nhập cách đọc…', 'Type the reading…')}/><button className="btn" disabled={!answer.trim()} type="submit">{t('Kiểm tra', 'Check')}<ArrowRight size={17}/></button></div><button type="button" className="text-btn" onClick={() => { setCorrect(false); setRevealed(true); }}>{t('Chưa nhớ, xem đáp án', 'I don’t recall, show answer')}</button></form>}
      {revealed && <div className="revealed-answer"><div className="answer-status" role="status">{correct !== null && <span className={correct ? 'feedback good' : 'feedback wrong'}>{correct ? <Check size={18}/> : <RotateCcw size={18}/>}{correct ? t('Chính xác!', 'That’s right!') : t('Chưa chính xác. Xem đáp án và thử lại.', 'Not quite. Let’s remember it together.')}</span>}{correct === false && answer && <small>{t('Câu trả lời: ', 'Your answer: ')}{answer}</small>}</div><div className="jp reading" lang="ja">{card.kana}</div>{s.settings.romaji && <p className="romaji">{card.romaji}</p>}<h2>{t(card.vi || card.en, card.en || card.vi)}</h2>{card.example && <div className="example"><p className="jp" lang="ja">{card.example}</p><p>{t(card.exampleVi, card.exampleEn)}</p><button className="text-btn" onClick={() => speak(card.example, true)}><Volume2 size={16}/>{t('Nghe ví dụ', 'Listen to example')}</button></div>}{card.note && <p className="review-note">{card.note}</p>}
      <div className="grade-section"><p>{correct === false ? t('Chọn “Học lại” để thử thêm một lần.', 'Choose “Again” for another try.') : t('Đánh giá độ nhớ', 'How well did you remember?')}</p><div className="grade-buttons">{['Again', 'Hard', 'Good', 'Easy'].map((name, i) => <button ref={i === 0 ? gradeButton : undefined} key={name} className={`grade g${i}`} disabled={storage === 'error' || (correct === false && i > 0)} onClick={() => grade(i)}><span className="grade-shortcut">{i + 1}</span><strong>{t(['Học lại', 'Khó', 'Nhớ', 'Dễ'][i], name)}</strong><small>{free ? t('Giữ lịch', 'Keep schedule') : i === 0 ? t('1 phút', '1 minute') : `${schedule(card, i).interval} ${t('ngày', 'days')}`}</small></button>)}</div></div></div>}
      </section><p className="keyboard-hint">{t('Space để mở đáp án · Phím 1–4 để đánh giá · Tiến độ đã ôn được tự lưu', 'Space to reveal · 1–4 to rate · Completed reviews save automatically')}</p>
    </div>}
    {exit && <Modal title={t('Dừng phiên ôn tại đây?', 'Pause here for today?')} close={() => setExit(false)}><p>{t('Lượt đã hoàn thành được giữ lại. Từ chưa trả lời sẽ xuất hiện trong phiên sau.', 'Completed reviews are kept. Unanswered words will be waiting next time.')}</p><div className="modal-actions"><button className="btn secondary" onClick={() => setExit(false)}>{t('Tiếp tục ôn', 'Keep going')}</button><button className="btn" onClick={() => { setExit(false); setQueue([]); }}>{t('Kết thúc phiên', 'Finish session')}</button></div></Modal>}
  </>;
}
function CheckCheckIcon() { return <CircleCheck size={19}/>; }
