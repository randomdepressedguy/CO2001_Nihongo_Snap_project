'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronLeft, ChevronRight, Download, FolderPlus, Layers, MoreHorizontal, Pencil, Plus, Search, SlidersHorizontal, Star, Trash2, Upload, Volume2, X } from 'lucide-react';
import { WORDS } from '@/lib/study/data';
import { type Card, type Word, makeCard, mergeWords, searchWords, validateWord } from '@/lib/study/core';
import { dueCards, importCollection, sameWord, topicNames, removeDeck } from '@/lib/study/collection';
import { useStudy } from './context';
import { Empty, Modal, PageHead, WordCard } from './shared';
export { Review } from './FocusReview';
const packs = [
    { title: ['Một ngày thường', 'Everyday essentials'], desc: ['Những từ gặp mỗi ngày, từ trang sách đến tách trà.', 'From a favorite book to a cup of tea.'], mark: '日', theme: 'sage', words: ['本', '水', 'お茶', '猫', '家', '学校', '友達', '今日', '食べる', '行く', '見る', '新しい'] },
    { title: ['Một chút ngon lành', 'At the table'], desc: ['Từ vựng về món ăn và đồ uống thông dụng.', 'Order something good. Talk about what you love.'], mark: '食', theme: 'peach', words: ['ご飯', 'パン', '卵', '牛乳', 'コーヒー', '肉', '野菜', '果物', '魚', 'りんご', 'お茶', '水'] },
    { title: ['Đồ vật hằng ngày', 'Look around'], desc: ['Tên gọi của những đồ vật thường gặp.', 'Find the words for the things around you.'], mark: '物', theme: 'lilac', words: ['本', '机', '椅子', '鞄', '時計', '電話', '傘', '靴', '服', '写真', '鍵', '車'] },
] as const;
function params() { return new URLSearchParams(typeof location === 'undefined' ? '' : location.search.slice(1) || location.hash.split('?')[1]); }
export function dueLabel(card: Card, vi = true) {
    if (card.reps === 0 && card.lapses === 0)
        return vi ? 'Từ mới' : 'New word';
    if (card.due <= Date.now())
        return vi ? 'Đến hạn' : 'Due now';
    return new Date(card.due).toLocaleDateString(vi ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'short' });
}
export function Decks({ detail, go }: {
    detail: (w: Word) => void;
    go: (p: string) => void;
}) {
    const { s, set, t, notify } = useStudy();
    const [deck, setDeck] = useState<string | null>(null);
    const [editDeck, setEditDeck] = useState<string | 'new' | null>(null);
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState<'decks' | 'words'>('decks');
    const due = dueCards(s.cards);
    const cards = searchWords(deck ? s.cards.filter(c => c.deck === deck) : s.cards, query);
    function addPack(pack: typeof packs[number]) {
        const name = pack.title[0];
        const words = WORDS.filter(w => (pack.words as readonly string[]).includes(w.jp));
        const existing = s.cards.filter(c => c.deck === name).length;
        const next = mergeWords({ ...s, decks: [...new Set([...s.decks, name])] }, words, name);
        set(() => next);
        setDeck(name);
        notify(t(`Đã thêm ${next.cards.filter(c => c.deck === name).length - existing} từ vào bộ thẻ.`, 'Starter words added to your deck.'));
    }
    return <>
    {deck ? <><button className="text-btn back" onClick={() => { setDeck(null); setQuery(''); }}><ArrowLeft size={17}/>{t('Tất cả bộ thẻ', 'All decks')}</button><PageHead eyebrow="単語帳 · COLLECTION" title={deck} desc={t(`${cards.length} từ trong bộ thẻ.`, `${cards.length} words in this deck.`)}><button className="btn" disabled={!cards.length} onClick={() => go(`review?deck=${encodeURIComponent(deck)}&free=1`)}>{t('Luyện bộ thẻ', 'Practice deck')}<ArrowRight size={17}/></button></PageHead><SearchField value={query} onChange={setQuery} label={t('Tìm trong bộ thẻ', 'Search this deck')}/><div className="word-grid">{cards.map(c => <WordCard key={c.id} word={c} detail={detail}/>)}</div>{!cards.length && <Empty title={query ? t('Chưa tìm thấy từ phù hợp.', 'No matching words.') : t('Bộ thẻ chưa có từ vựng.', 'This deck is waiting for its first word.')} desc={t('Thêm từ trong Sổ tay hoặc lưu từ Từ điển vào bộ thẻ này.', 'Add a word in Notebook, or save one from Dictionary.')}><button className="btn secondary" onClick={() => go('dictionary')}>{t('Mở từ điển', 'Open dictionary')}<ArrowRight size={17}/></button></Empty>}</> : <>
      <PageHead eyebrow="単語カード · YOUR LITTLE COLLECTION" title={t('Thẻ từ vựng', 'A little Japanese, every day.')} desc={t('Tạo bộ thẻ, sắp xếp theo chủ đề và luyện nhớ.', 'Keep the words you love. Remember what you learn.')}><button className="btn secondary" onClick={() => setEditDeck('')}><Plus size={17}/>{t('Tạo bộ thẻ', 'Create a deck')}</button></PageHead>
      <section className="daily-hero"><div className="hero-copy"><span className="eyebrow">{t('MỘT CHÚT HÔM NAY, NHỚ LÂU NGÀY MAI', 'A LITTLE TODAY, A LITTLE MORE TOMORROW')}</span><h2>{due.length ? t('Ôn tập các từ\nđến hạn hôm nay.', 'Review words\ndue today.') : s.cards.length ? t('Đã hoàn thành\ncác từ đến hạn.', 'Your words,\na little closer.') : t('Xây dựng bộ thẻ.\nGhi nhớ từng ngày.', 'Start with a word.\nMake it stay.')}</h2><p>{due.length ? t(`${due.length} từ đến hạn. Lịch ôn được cập nhật sau mỗi câu trả lời.`, `${due.length} words are ready to revisit. Take them one at a time.`) : s.cards.length ? t('Có thể luyện tự do để giữ nguyên lịch ôn, hoặc bổ sung từ mới.', 'You’re all caught up. Practice a little more or find a new word.') : t('Chọn một bộ từ gợi ý bên dưới, hoặc tự tạo bộ thẻ đầu tiên.', 'Choose a small starter set below, or make your first deck.')}</p><button className="btn" onClick={() => due.length ? go('review') : s.cards.length ? go('review?free=1') : document.getElementById('starter-packs')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}>{due.length ? t('Ôn tập hôm nay', 'Review today') : s.cards.length ? t('Luyện thẻ từ vựng', 'Practice your words') : t('Chọn bộ từ đầu tiên', 'Find your first words')}<ArrowRight size={18}/></button></div><div className="hero-cards" aria-hidden="true"><span className="hero-orbit"/><div className="paper-card paper-back jp">言葉<small>ことば</small></div><div className="paper-card paper-front"><span className="card-index">01 / 12 <span>日本語</span></span><span className="jp">木漏れ日</span><small className="jp">こもれび</small><hr /><strong>{t('Nắng xuyên qua kẽ lá', 'Sunlight through the leaves')}</strong><span className="paper-foot">komorebi <Volume2 size={17}/></span></div><span className="hero-stamp jp">少しずつ</span></div></section>
      <section className="collection-section"><div className="section-title"><div className="section-heading"><h2>{t('Bộ thẻ đã lưu', 'Your collection')}</h2><span className="small-count">{s.cards.length} {t('từ', 'words')}</span></div><div className="view-switch" role="group" aria-label={t('Chế độ xem', 'Collection view')}><button aria-pressed={tab === 'decks'} onClick={() => setTab('decks')}><Layers size={16}/>{t('Bộ thẻ', 'Decks')}</button><button aria-pressed={tab === 'words'} onClick={() => setTab('words')}><BookOpen size={16}/>{t('Tất cả từ', 'All words')}</button></div></div>
      {tab === 'decks' ? <div className="deck-grid">{s.decks.map((d, i) => { const words = s.cards.filter(c => c.deck === d); const count = dueCards(words).length; const studied = words.filter(c => c.reps > 0).length; return <article key={d} className="deck-card"><button className={`deck-cover theme-${['sage', 'peach', 'lilac', 'sand'][i % 4]}`} onClick={() => setDeck(d)} aria-label={t('Mở bộ thẻ ', 'Open deck ') + d}><span className="cover-line"/><span className="jp" lang="ja">{words[0]?.jp.slice(0, 2) || '言'}</span><span className="cover-caption">私の言葉 / {String(i + 1).padStart(2, '0')}</span></button><div className="deck-body"><div className="row spread"><button className="deck-title" onClick={() => setDeck(d)}>{d === 'My words' ? t('Từ đã lưu', 'My words') : d}</button><button className="icon-btn" aria-label={t('Chỉnh bộ thẻ ', 'Edit deck ') + d} onClick={() => setEditDeck(d)}><MoreHorizontal size={19}/></button></div><p>{words.length} {t('từ', 'words')}<span className="separator">/</span>{count ? <span className="due-text">{count} {t('chờ ôn', 'due')}</span> : t('Chưa có từ đến hạn', 'All caught up')}</p><div className="deck-progress" aria-label={t(`${studied} trên ${words.length} từ đã ôn`, `${studied} of ${words.length} words reviewed`)}><span style={{ width: `${words.length ? studied / words.length * 100 : 0}%` }}/></div><button className="text-btn" onClick={() => setDeck(d)}>{t('Mở bộ thẻ', 'Open deck')}<ArrowUpRight size={16}/></button></div></article>; })}<button className="new-deck" onClick={() => setEditDeck('')}><span><Plus size={24} strokeWidth={1.4}/></span><strong>{t('Một bộ thẻ mới', 'A fresh collection')}</strong><p>{t('Sắp xếp từ vựng theo chủ đề.', 'For the things you want to remember.')}</p></button></div> : <>{s.cards.length ? <div className="word-grid">{s.cards.map(w => <WordCard key={w.id} word={w} detail={detail}/>)}</div> : <Empty title={t('Chưa có từ nào trong sổ.', 'Your first words are waiting.')} desc={t('Chọn một bộ gợi ý bên dưới để bắt đầu.', 'Choose a starter set below to begin.')}/>}</>}
      </section>
      <section id="starter-packs" className="starter-section"><div className="section-title"><div><span className="eyebrow">{t('BỘ TỪ GỢI Ý', 'A LITTLE INSPIRATION')}</span><h2>{t('Chưa biết bắt đầu từ đâu?', 'Not sure where to start?')}</h2></div><span className="section-aside">{t('Chọn một bộ, học từng chút.', 'Pick a set. Take your time.')}</span></div><div className="starter-grid">{packs.map(pack => <article key={pack.mark} className="starter-card"><span className={`pack-mark theme-${pack.theme} jp`} aria-hidden="true">{pack.mark}</span><h3>{t(pack.title[0], pack.title[1])}</h3><p>{t(pack.desc[0], pack.desc[1])}</p><button className="text-btn" onClick={() => addPack(pack)}>{t('Thêm bộ từ', 'Add starter set')}<Plus size={16}/></button></article>)}</div></section>
    </>}
    {editDeck !== null && <DeckEditor deck={editDeck || undefined} close={() => setEditDeck(null)}/>}
  </>;
}
export function SearchField({ value, onChange, label }: {
    value: string;
    onChange: (v: string) => void;
    label: string;
}) {
    return <div className="search-field"><Search size={19}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={label} aria-label={label}/>{value && <button className="icon-btn" onClick={() => onChange('')} aria-label="Xóa tìm kiếm / Clear search"><X size={17}/></button>}</div>;
}
export function CardEditor({ card, initial, close }: {
    card?: Card;
    initial?: Card;
    close: () => void;
}) {
    const { s, set, t, notify } = useStudy();
    const [w, setW] = useState(card ?? initial ?? makeCard({ id: '', jp: '', kana: '', romaji: '', vi: '', en: '', tag: 'custom', level: '—', example: '', exampleVi: '', exampleEn: '' }, params().get('deck') || s.decks[0]));
    const [error, setError] = useState('');
    function submit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!w.jp.trim() || !w.kana.trim() || !(w.vi.trim() || w.en.trim())) {
            setError(t('Cần có từ tiếng Nhật, cách đọc và ít nhất một nghĩa.', 'Add Japanese, a reading and at least one meaning.'));
            return;
        }
        if (s.cards.some(c => c.id !== w.id && c.deck === w.deck && sameWord(c, w))) {
            setError(t('Từ đã có trong bộ thẻ. Chọn bộ khác để lưu thêm.', 'This word is already in the deck. Choose another deck.'));
            return;
        }
        const clean = { ...w, ...validateWord(w) };
        set(x => ({ ...x, cards: card ? x.cards.map(c => c.id === clean.id ? clean : c) : [...x.cards, clean] }));
        notify(t('Đã lưu từ vào sổ tay.', 'Word saved to your notebook.'));
        close();
    }
    return <Modal title={card ? t('Chỉnh sửa từ', 'Edit word') : t('Thêm một từ mới', 'Add a new word')} close={close}><p className="modal-intro">{t('Nhập từ tiếng Nhật, cách đọc và ít nhất một nghĩa.', 'Something you just learned. Something worth keeping.')}</p><form className="form" onSubmit={submit}>
    <div className="grid two"><label>{t('Từ tiếng Nhật *', 'Japanese word *')}<input autoFocus required maxLength={100} value={w.jp} placeholder="木漏れ日" onChange={e => setW({ ...w, jp: e.target.value })}/></label><label>{t('Cách đọc kana *', 'Kana reading *')}<input required maxLength={100} value={w.kana} placeholder="こもれび" onChange={e => setW({ ...w, kana: e.target.value })}/></label></div>
    <div className="grid two"><label>{t('Nghĩa tiếng Việt', 'Vietnamese meaning')}<input maxLength={300} value={w.vi} placeholder="Nắng xuyên qua kẽ lá" onChange={e => setW({ ...w, vi: e.target.value })}/></label><label>English meaning<input maxLength={300} value={w.en} placeholder="Sunlight through the leaves" onChange={e => setW({ ...w, en: e.target.value })}/></label></div>
    <div className="grid two"><label>Romaji<input maxLength={100} value={w.romaji} placeholder="komorebi" onChange={e => setW({ ...w, romaji: e.target.value })}/></label><label>{t('Lưu vào bộ thẻ', 'Save in deck')}<select value={w.deck} onChange={e => setW({ ...w, deck: e.target.value })}>{s.decks.map(d => <option key={d}>{d}</option>)}</select></label></div>
    <details className="editor-details" open={!!card}><summary>{t('Ví dụ & ghi chú', 'Example & personal note')}</summary><div className="form"><label>{t('Câu ví dụ tiếng Nhật', 'Japanese example')}<input maxLength={500} value={w.example} onChange={e => setW({ ...w, example: e.target.value })}/></label><div className="grid two"><label>{t('Dịch tiếng Việt', 'Vietnamese translation')}<input maxLength={500} value={w.exampleVi} onChange={e => setW({ ...w, exampleVi: e.target.value })}/></label><label>English translation<input maxLength={500} value={w.exampleEn} onChange={e => setW({ ...w, exampleEn: e.target.value })}/></label></div><label>{t('Ghi chú riêng', 'Personal note')}<textarea maxLength={2000} value={w.note} placeholder={t('Mẹo ghi nhớ, nguồn tham khảo…', 'A memory cue, where you found this word…')} onChange={e => setW({ ...w, note: e.target.value })}/></label></div></details>
    {error && <p className="inline-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="btn secondary" onClick={close}>{t('Hủy', 'Cancel')}</button><button className="btn" type="submit"><Check size={17}/>{t('Lưu từ', 'Save word')}</button></div>
  </form></Modal>;
}
function DeckEditor({ deck, close }: {
    deck?: string;
    close: () => void;
}) {
    const { s, set, t, notify } = useStudy();
    const [name, setName] = useState(deck ?? '');
    const [error, setError] = useState('');
    const [remove, setRemove] = useState(false);
    function submit(e: React.FormEvent) { e.preventDefault(); const clean = name.trim(); if (!clean) {
        setError(t('Nhập tên bộ thẻ.', 'Enter a deck name.'));
        return;
    } if (s.decks.includes(clean) && clean !== deck) {
        setError(t('Tên bộ thẻ đã tồn tại.', 'That deck already exists.'));
        return;
    } set(x => ({ ...x, decks: deck ? x.decks.map(d => d === deck ? clean : d) : [...x.decks, clean], cards: deck ? x.cards.map(c => c.deck === deck ? { ...c, deck: clean } : c) : x.cards })); notify(t('Đã lưu bộ thẻ.', 'Deck saved.')); close(); }
    return <Modal title={deck ? t('Chỉnh bộ thẻ', 'Edit deck') : t('Một bộ thẻ mới', 'A new collection')} close={close}><form className="form" onSubmit={submit}><label>{t('Tên bộ thẻ', 'Deck name')}<input autoFocus maxLength={60} value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder={t('Ví dụ: Những từ gặp trong sách', 'e.g. Words from my reading')}/></label>{error && <p role="alert" className="inline-error">{error}</p>}<button className="btn" type="submit">{t('Lưu bộ thẻ', 'Save deck')}<Check size={17}/></button>{deck && s.decks.length > 1 && <><hr /><button type="button" className="text-btn danger" onClick={() => setRemove(true)}><Trash2 size={17}/>{t('Xóa bộ thẻ…', 'Remove deck…')}</button>{remove && <div className="notice"><p>{t('Các từ sẽ chuyển sang bộ thẻ khác. Từ trùng sẽ gộp ghi chú, yêu thích và giữ lịch ôn sớm hơn.', 'Words move to another deck. Duplicates combine notes and favorites, keeping the earlier review date.')}</p><button type="button" className="btn secondary" onClick={() => { try { const next = removeDeck(s, deck); set(() => next); } catch { notify(t('Ghi chú gộp vượt 2.000 ký tự. Hãy rút gọn ghi chú từ trùng trước.', 'Merged notes exceed 2,000 characters. Shorten duplicate notes first.')); return; }
                            notify(t('Đã chuyển từ và xóa bộ thẻ.', 'Words moved and deck removed.')); close(); }}>{t('Chuyển từ & xóa bộ thẻ', 'Move words & remove deck')}</button></div>}</>}</form></Modal>;
}
export function Notebook({ detail }: {
    detail: (w: Word) => void;
}) {
    const { s, set, t, notify } = useStudy();
    const [query, setQuery] = useState('');
    const [deck, setDeck] = useState(() => params().get('deck') || 'all');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');
    const [editor, setEditor] = useState<Card | 'new' | null>(null);
    const [undo, setUndo] = useState<Card | null>(null);
    const [page, setPage] = useState(0);
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => setPage(0), [query, deck, filter, sort]);
    const cards = searchWords(s.cards, query).filter(c => (deck === 'all' || c.deck === deck) && (filter === 'all' || (filter === 'favorite' ? c.favorite : c.due <= Date.now()))).sort((a, b) => sort === 'kana' ? a.kana.localeCompare(b.kana, 'ja') : sort === 'due' ? a.due - b.due : b.created - a.created);
    const visible = cards.slice(page * 20, (page + 1) * 20);
    async function importFile(file?: File) { if (!file)
        return; try {
        if (file.size > 10 * 1024 * 1024)
            throw Error('TOO_LARGE');
        const raw: unknown = JSON.parse(await file.text());
        const next = importCollection(s, raw, deck === 'all' ? s.decks[0] : deck);
        set(() => next);
        notify(t(`Đã nhập ${next.cards.length - s.cards.length} từ mới. Các từ cũ được giữ nguyên.`, `Imported ${next.cards.length - s.cards.length} new words. Existing words are preserved.`));
    }
    catch {
        notify(t('Không nhập được. Dùng tệp JSON của Nihongo Snap hoặc danh sách từ hợp lệ, tối đa 10 MB.', 'Import failed. Use a Nihongo Snap JSON backup or valid word list, up to 10 MB.'));
    } if (input.current)
        input.current.value = ''; }
    return <><PageHead eyebrow="単語帳 · NOTEBOOK" title={t('Sổ tay từ vựng', 'Your words. Your notebook.')} desc={t('Quản lý từ đã lưu, câu ví dụ và ghi chú.', 'Collect, organize, and add a little meaning of your own.')}><button className="btn" onClick={() => setEditor('new')}><Plus size={18}/>{t('Thêm từ', 'Add a word')}</button></PageHead>
    <div className="notebook-toolbar"><SearchField value={query} onChange={setQuery} label={t('Tìm từ, cách đọc hoặc nghĩa…', 'Search word, reading or meaning…')}/><div className="row"><button className="btn secondary compact" onClick={() => downloadJSON(s, 'nihongo-snap-backup.json')}><Download size={16}/><span>{t('Xuất sổ', 'Export')}</span></button><button className="btn secondary compact" onClick={() => input.current?.click()}><Upload size={16}/><span>{t('Nhập từ', 'Import')}</span></button><input hidden ref={input} type="file" accept=".json,application/json" onChange={e => importFile(e.target.files?.[0])}/></div></div>
    <div className="notebook-filters"><div className="filter-tabs" role="group" aria-label={t('Lọc từ', 'Filter words')}>{[['all', 'Tất cả', 'All'], ['due', 'Chờ ôn', 'Due'], ['favorite', 'Yêu thích', 'Favorites']].map(([id, vi, en]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{id === 'favorite' && <Star size={15}/>}{t(vi, en)}<span>{id === 'all' ? s.cards.length : id === 'due' ? dueCards(s.cards).length : s.cards.filter(c => c.favorite).length}</span></button>)}</div><div className="row"><select aria-label={t('Lọc bộ thẻ', 'Filter deck')} value={deck} onChange={e => setDeck(e.target.value)}><option value="all">{t('Mọi bộ thẻ', 'All decks')}</option>{s.decks.map(d => <option key={d}>{d}</option>)}</select><select aria-label={t('Sắp xếp từ', 'Sort words')} value={sort} onChange={e => setSort(e.target.value)}><option value="newest">{t('Mới nhất', 'Newest first')}</option><option value="kana">{t('Theo cách đọc', 'By reading')}</option><option value="due">{t('Lịch ôn gần nhất', 'Next review')}</option></select></div></div>
    {undo && <div className="undo-notice" role="status"><span>{t(`Đã xóa ${undo.jp}.`, `${undo.jp} removed.`)}</span><button className="text-btn" onClick={() => { set(x => ({ ...x, decks: [...new Set([...x.decks, undo.deck])], cards: x.cards.some(c => c.id === undo.id) ? x.cards : [...x.cards, undo] })); setUndo(null); }}>{t('Hoàn tác', 'Undo')}</button></div>}
    {cards.length ? <><div className="notebook-table"><div className="notebook-table-head"><span>{t('TỪ VỰNG', 'WORD')}</span><span>{t('Ý NGHĨA & GHI CHÚ', 'MEANING & NOTE')}</span><span>{t('BỘ THẺ / LỊCH ÔN', 'DECK / REVIEW')}</span><span /></div>{visible.map(c => <article key={c.id} className="notebook-row"><button className="notebook-word" onClick={() => detail(c)}><span className="jp" lang="ja">{c.jp}</span><small className="jp" lang="ja">{c.kana}{s.settings.romaji && c.romaji && <span> · {c.romaji}</span>}</small></button><div className="notebook-meaning"><strong>{t(c.vi || c.en, c.en || c.vi)}</strong><p>{c.note || t(c.exampleVi, c.exampleEn) || t('Chưa có ghi chú.', 'Add a note to make it yours.')}</p></div><div className="notebook-meta"><span>{c.deck}</span><small className={c.due <= Date.now() ? 'due-text' : ''}>{dueLabel(c, s.settings.lang === 'vi')}</small></div><div className="card-tools"><WordActions card={c} edit={() => setEditor(c)} remove={() => { set(x => ({ ...x, cards: x.cards.filter(a => a.id !== c.id) })); setUndo(c); if (page > 0 && visible.length === 1)
        setPage(page - 1); }}/></div></article>)}</div><Pagination page={page} total={cards.length} size={20} change={setPage}/></> : <Empty title={s.cards.length ? t('Không tìm thấy từ phù hợp.', 'No matching words.') : t('Cuốn sổ đang chờ câu chuyện đầu tiên.', 'A fresh page for your first words.')} desc={s.cards.length ? t('Thử đổi bộ lọc hoặc từ khóa tìm kiếm.', 'Try another filter or search term.') : t('Thêm từ mới hoặc lưu kết quả tra cứu từ Từ điển.', 'Add a word you’ve just found, or save one from Dictionary.')}><button className="btn secondary" onClick={() => s.cards.length ? (setQuery(''), setFilter('all'), setDeck('all')) : setEditor('new')}>{s.cards.length ? t('Xóa bộ lọc', 'Clear filters') : t('Thêm từ đầu tiên', 'Add your first word')}<Plus size={17}/></button></Empty>}
    {editor && <CardEditor card={editor === 'new' ? undefined : editor} close={() => setEditor(null)}/>}
  </>;
}
function WordActions({ card, edit, remove }: {
    card: Card;
    edit: () => void;
    remove: () => void;
}) { const { t, set, speak } = useStudy(); return <><button className="icon-btn" aria-label={t('Nghe ', 'Listen to ') + card.jp} onClick={() => speak(card.jp)}><Volume2 size={17}/></button><button className={`icon-btn ${card.favorite ? 'favorite' : ''}`} aria-label={t('Yêu thích ', 'Favorite ') + card.jp} aria-pressed={card.favorite} onClick={() => set(x => ({ ...x, cards: x.cards.map(c => c.id === card.id ? { ...c, favorite: !c.favorite } : c) }))}><Star size={17} fill={card.favorite ? 'currentColor' : 'none'}/></button><button className="icon-btn" aria-label={t('Sửa ', 'Edit ') + card.jp} onClick={edit}><Pencil size={17}/></button><button className="icon-btn danger" aria-label={t('Xóa ', 'Remove ') + card.jp} onClick={remove}><Trash2 size={17}/></button></>; }
export function Dictionary({ seed, detail }: {
    seed: string;
    detail: (w: Word) => void;
}) {
    const { s, t } = useStudy();
    const [query, setQuery] = useState(seed);
    const [tag, setTag] = useState('all');
    const [page, setPage] = useState(0);
    useEffect(() => { setQuery(seed); setTag('all'); }, [seed]);
    useEffect(() => setPage(0), [query, tag]);
    const words = searchWords(WORDS, query).filter(w => tag === 'all' || w.tag === tag);
    const topics = [...new Set(WORDS.map(w => w.tag))];
    return <><PageHead eyebrow="辞書 · A SMALL DICTIONARY" title={t('Từ điển tiếng Nhật', 'Japanese dictionary')} desc={t('Tra tiếng Nhật, kana, romaji hoặc nghĩa tiếng Việt.', 'Search Japanese, kana, romaji, Vietnamese or English.')}/>
    <section className="dictionary-search"><div className="dictionary-stamp jp" lang="ja" aria-hidden="true">辞</div><div><SearchField value={query} onChange={setQuery} label={t('Nhập từ, cách đọc hoặc nghĩa…', 'What word are you looking for?')}/><p>{t('Thử tìm:', 'Try:')} {['neko', 'お茶', 'học'].map(w => <button key={w} onClick={() => setQuery(w)}>{w}</button>)}<span className="dictionary-size">{WORDS.length} {t('từ nền tảng', 'starter entries')}</span></p></div></section>
    <div className="dictionary-layout"><aside className="topic-list"><span className="eyebrow">{t('DẠO QUA CHỦ ĐỀ', 'BROWSE BY TOPIC')}</span><button className={tag === 'all' ? 'selected' : ''} aria-pressed={tag === 'all'} onClick={() => setTag('all')}>{t('Tất cả từ', 'All entries')}<span>{WORDS.length}</span></button>{topics.map(topic => <button key={topic} className={tag === topic ? 'selected' : ''} aria-pressed={tag === topic} onClick={() => setTag(topic)}>{topicNames[topic] ? t(...topicNames[topic]) : topic}<span>{WORDS.filter(w => w.tag === topic).length}</span></button>)}<p className="hint">{t('Bộ từ điển nền tảng phục vụ học hằng ngày. Có thể tự thêm từ trong Sổ tay.', 'A curated starter dictionary for everyday learning. Add any word of your own in Notebook.')}</p></aside><div className="dictionary-results"><div className="results-heading"><h2>{query ? t(`Kết quả cho “${query}”`, `Results for “${query}”`) : tag === 'all' ? t('Những từ để bắt đầu', 'Words to start with') : topicNames[tag] ? t(...topicNames[tag]) : tag}</h2><span>{words.length} {t('từ', 'entries')}</span></div>{words.length ? <><div className="dictionary-entries">{words.slice(page * 15, (page + 1) * 15).map((w, i) => <article key={w.id} className="dictionary-entry"><span className="entry-number">{String(page * 15 + i + 1).padStart(2, '0')}</span><div className="entry-content"><div className="row wrap"><button className="entry-word jp" lang="ja" onClick={() => detail(w)}>{w.jp}</button><span className="entry-reading jp" lang="ja">{w.kana}</span>{s.settings.romaji && <span className="entry-romaji">{w.romaji}</span>}<span className="tag">{w.level}</span></div><strong>{t(w.vi, w.en)}</strong><p className="jp" lang="ja">{w.example}</p><small>{t(w.exampleVi, w.exampleEn)}</small></div><button className={`icon-btn bordered ${s.cards.some(c => sameWord(c, w)) ? 'saved' : ''}`} aria-label={t('Xem và lưu ', 'View and save ') + w.jp} onClick={() => detail(w)}>{s.cards.some(c => sameWord(c, w)) ? <Check size={18}/> : <Plus size={18}/>}</button></article>)}</div><Pagination page={page} total={words.length} size={15} change={setPage}/></> : <Empty title={t('Chưa có từ này trong từ điển nhỏ.', 'This word isn’t in our little dictionary.')} desc={t('Thử cách đọc khác, bỏ bộ lọc chủ đề, hoặc tự thêm từ vào Sổ tay.', 'Try another reading, remove the topic filter, or add your own word in Notebook.')}><button className="btn secondary" onClick={() => { setQuery(''); setTag('all'); }}>{t('Xem tất cả từ', 'Show all entries')}</button></Empty>}</div></div>
  </>;
}
function Pagination({ page, total, size, change }: {
    page: number;
    total: number;
    size: number;
    change: (p: number) => void;
}) { const { t } = useStudy(); const pages = Math.ceil(total / size); return <div className="pagination"><span>{Math.min(page * size + 1, total)}–{Math.min((page + 1) * size, total)} / {total} {t('từ', 'words')}</span><div className="row"><button className="icon-btn bordered" disabled={page === 0} aria-label={t('Trang trước', 'Previous page')} onClick={() => change(page - 1)}><ChevronLeft size={18}/></button><span>{page + 1} / {pages}</span><button className="icon-btn bordered" disabled={page + 1 >= pages} aria-label={t('Trang sau', 'Next page')} onClick={() => change(page + 1)}><ChevronRight size={18}/></button></div></div>; }
export function downloadJSON(data: unknown, name: string) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
