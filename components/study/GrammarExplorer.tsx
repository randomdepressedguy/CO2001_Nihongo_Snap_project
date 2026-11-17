'use client';
import { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Plus,
  Sparkles,
  Volume2
} from 'lucide-react';
import {
  type GrammarEntry,
  type KanjiEntry,
  type JlptLevelFilter,
  grammarEntryToStudyWord,
  kanjiEntryToStudyWord,
  getVocabByWord,
  vocabEntryToStudyWord
} from '@/src/services/dictionaryDbService';
import { sameWord } from '@/lib/study/collection';
import type { Word } from '@/lib/study/core';
import { useStudy } from './context';
import { Empty, Modal } from './shared';

export function GrammarDetailCard({
  grammar,
  close
}: {
  grammar: GrammarEntry;
  close: () => void;
}) {
  const { s, t, save, speak } = useStudy();
  const [deck, setDeck] = useState(s.decks[0] || 'My words');
  const studyWord = grammarEntryToStudyWord(grammar);
  const exists = s.cards.some(c => c.deck === deck && sameWord(c, studyWord));

  return (
    <Modal
      title={t('Chi tiết cấu trúc ngữ pháp', 'Grammar Structure Detail')}
      close={close}
      wide
    >
      <div className="grammar-detail-modal">
        <div className="grammar-detail-header">
          <div className="row wrap">
            <span className={`tag jlpt-badge jlpt-${grammar.jlpt.toLowerCase()}`}>
              JLPT {grammar.jlpt}
            </span>
            <span className="eyebrow">文法 · GRAMMAR POINT</span>
          </div>
          <div className="row spread">
            <div>
              <h3 className="jp grammar-detail-title" lang="ja">
                {grammar.title}
              </h3>
              <p className="grammar-detail-reading jp" lang="ja">
                {grammar.reading}
                {s.settings.romaji && grammar.romaji && (
                  <span> · {grammar.romaji}</span>
                )}
              </p>
            </div>
            <button
              type="button"
              className="btn secondary compact"
              onClick={() => speak(grammar.title.replace(/^[〜～~]/, ''))}
            >
              <Volume2 size={17} />
              <span>{t('Nghe', 'Listen')}</span>
            </button>
          </div>
        </div>

        <section className="grammar-meaning-box">
          <span className="eyebrow">{t('Ý NGHĨA', 'MEANING')}</span>
          <h4>{grammar.meaning.vi}</h4>
          <p className="muted">{grammar.meaning.en}</p>
        </section>

        <section className="grammar-formation-box">
          <div className="row">
            <Layers size={16} />
            <span className="eyebrow">
              {t('CÁCH CHIA / CẤU TẠO (FORMATION)', 'FORMATION RULES')}
            </span>
          </div>
          <ul className="grammar-formation-list">
            {grammar.formation.map((rule, idx) => (
              <li key={idx} className="jp">
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="grammar-explanation-box">
          <span className="eyebrow">
            {t('GIẢI THÍCH CHI TIẾT', 'DETAILED EXPLANATION')}
          </span>
          <p>{grammar.explanation}</p>
          {grammar.notes && (
            <div className="grammar-note-callout">
              <Info size={16} />
              <div>
                <strong>{t('Lưu ý:', 'Note:')}</strong> {grammar.notes}
              </div>
            </div>
          )}
        </section>

        {grammar.examples.length > 0 && (
          <section className="grammar-examples-box">
            <span className="eyebrow">
              {t('CÂU VÍ DỤ SONG NGỮ', 'BILINGUAL EXAMPLES')}
            </span>
            <div className="grammar-example-list">
              {grammar.examples.map((ex, idx) => (
                <div key={idx} className="example grammar-example-item">
                  <div className="row spread">
                    <div>
                      <p className="jp grammar-ex-ja" lang="ja">
                        {ex.ja}
                      </p>
                      {s.settings.furigana && ex.furigana && ex.furigana !== ex.ja && (
                        <small className="jp grammar-ex-furigana" lang="ja">
                          {ex.furigana}
                        </small>
                      )}
                      <p className="grammar-ex-vi">{ex.vi}</p>
                      <small className="muted">{ex.en}</small>
                    </div>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={t('Nghe câu ví dụ', 'Listen to example')}
                      onClick={() => speak(ex.ja)}
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="detail-save">
          <label>
            {t('Chọn bộ thẻ học tập', 'Select study deck')}
            <select value={deck} onChange={e => setDeck(e.target.value)}>
              {s.decks.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`btn ${exists ? 'secondary' : ''}`}
            disabled={exists}
            onClick={() => save(studyWord, deck)}
          >
            {exists ? <Check size={17} /> : <Bookmark size={17} />}
            <span>
              {exists
                ? t('Đã lưu trong bộ thẻ', 'Saved in this deck')
                : t('Lưu vào bộ thẻ / Bookmark', 'Save to Study Deck')}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function KanjiDetailCard({
  kanji,
  close,
  onSelectWord
}: {
  kanji: KanjiEntry;
  close: () => void;
  onSelectWord?: (w: Word) => void;
}) {
  const { s, t, save, speak } = useStudy();
  const [deck, setDeck] = useState(s.decks[0] || 'My words');
  const studyWord = kanjiEntryToStudyWord(kanji);
  const exists = s.cards.some(c => c.deck === deck && sameWord(c, studyWord));

  return (
    <Modal
      title={t('Chi tiết chữ Hán (Kanji)', 'Kanji Character Detail')}
      close={close}
    >
      <div className="kanji-detail-modal">
        <div className="kanji-hero-row">
          <div className="kanji-big-box jp" lang="ja">
            {kanji.character}
          </div>
          <div className="kanji-hero-meta">
            <div className="row wrap">
              <span className="hanviet-badge">{kanji.hanViet}</span>
              <span className={`tag jlpt-badge jlpt-${kanji.jlpt.toLowerCase()}`}>
                {kanji.jlpt}
              </span>
              <span className="tag">
                {kanji.strokes} {t('nét', 'strokes')}
              </span>
              <span className="tag">
                {t('Bộ:', 'Radical:')} {kanji.radical}
              </span>
            </div>
            <h3>{kanji.meanings.vi.join(' · ')}</h3>
            <p className="muted">{kanji.meanings.en.join(' · ')}</p>
            <button
              type="button"
              className="btn secondary compact"
              onClick={() => speak(kanji.character)}
            >
              <Volume2 size={16} />
              <span>{t('Nghe phát âm', 'Listen')}</span>
            </button>
          </div>
        </div>

        <div className="reading-pair">
          <div>
            <small>ON · 音読み (Âm On)</small>
            <p className="jp" lang="ja">
              {kanji.onyomi.length ? kanji.onyomi.join(' ・ ') : '—'}
            </p>
          </div>
          <div>
            <small>KUN · 訓読み (Âm Kun)</small>
            <p className="jp" lang="ja">
              {kanji.kunyomi.length ? kanji.kunyomi.join(' ・ ') : '—'}
            </p>
          </div>
        </div>

        {kanji.examples.length > 0 && (
          <div className="example">
            <span className="eyebrow">
              {t('TỪ GHÉP TIÊU BIỂU', 'COMMON COMPOUND WORDS')}
            </span>
            <div className="row wrap kanji-example-chips">
              {kanji.examples.map(ex => {
                const matchedVocab = getVocabByWord(ex);
                return (
                  <button
                    key={ex}
                    type="button"
                    className="kanji-compound-chip jp"
                    lang="ja"
                    onClick={() => {
                      if (matchedVocab && onSelectWord) {
                        close();
                        onSelectWord(vocabEntryToStudyWord(matchedVocab));
                      } else {
                        speak(ex);
                      }
                    }}
                  >
                    <strong>{ex}</strong>
                    {matchedVocab && (
                      <small>
                        {matchedVocab.reading} · {matchedVocab.meanings.vi[0]}
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="detail-save">
          <label>
            {t('Chọn bộ thẻ', 'Your deck')}
            <select value={deck} onChange={e => setDeck(e.target.value)}>
              {s.decks.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`btn ${exists ? 'secondary' : ''}`}
            disabled={exists}
            onClick={() => save(studyWord, deck)}
          >
            {exists ? <Check size={17} /> : <Plus size={17} />}
            <span>
              {exists
                ? t('Đã có trong bộ thẻ', 'Saved in this deck')
                : t('Lưu Kanji vào bộ thẻ', 'Save Kanji to Deck')}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function GrammarExplorer({
  items,
  jlptFilter,
  onJlptChange,
  onSelectGrammar
}: {
  items: GrammarEntry[];
  jlptFilter: JlptLevelFilter;
  onJlptChange?: (level: JlptLevelFilter) => void;
  onSelectGrammar?: (g: GrammarEntry) => void;
}) {
  const { s, t, save } = useStudy();
  const [page, setPage] = useState(0);
  const [activeGrammar, setActiveGrammar] = useState<GrammarEntry | null>(null);
  const pageSize = 12;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = items.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const openDetail = (g: GrammarEntry) => {
    if (onSelectGrammar) {
      onSelectGrammar(g);
    } else {
      setActiveGrammar(g);
    }
  };

  return (
    <div className="grammar-explorer">
      {onJlptChange && (
        <div className="row spread grammar-explorer-bar">
          <div className="filter-tabs" role="group" aria-label={t('Lọc trình độ JLPT', 'Filter JLPT Level')}>
            {(['ALL', 'N5', 'N4'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                aria-pressed={jlptFilter === lvl}
                onClick={() => {
                  onJlptChange(lvl);
                  setPage(0);
                }}
              >
                {lvl === 'ALL' ? t('Tất cả N5–N4', 'All N5–N4') : `JLPT ${lvl}`}
              </button>
            ))}
          </div>
          <span className="small-count">
            <Sparkles size={14} /> {items.length} {t('cấu trúc ngữ pháp', 'grammar points')}
          </span>
        </div>
      )}

      {visible.length > 0 ? (
        <>
          <div className="grammar-grid">
            {visible.map(g => {
              const studyWord = grammarEntryToStudyWord(g);
              const isBookmarked = s.cards.some(c => sameWord(c, studyWord));
              const ex = g.examples[0];
              return (
                <article key={g.id} className="grammar-card">
                  <div className="row spread">
                    <span className={`tag jlpt-badge jlpt-${g.jlpt.toLowerCase()}`}>
                      {g.jlpt}
                    </span>
                    <button
                      type="button"
                      className={`icon-btn bordered ${isBookmarked ? 'saved' : ''}`}
                      aria-label={t('Lưu cấu trúc ', 'Bookmark ') + g.title}
                      title={
                        isBookmarked
                          ? t('Đã lưu trong bộ thẻ', 'Saved in study deck')
                          : t('Lưu vào bộ thẻ học tập', 'Save to study deck')
                      }
                      onClick={() => save(studyWord, s.decks[0])}
                    >
                      {isBookmarked ? <Check size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="grammar-card-main"
                    onClick={() => openDetail(g)}
                  >
                    <h3 className="jp" lang="ja">
                      {g.title}
                    </h3>
                    <small className="jp muted" lang="ja">
                      {g.reading} {s.settings.romaji && g.romaji ? `· ${g.romaji}` : ''}
                    </small>
                    <strong className="grammar-card-meaning">
                      {t(g.meaning.vi, g.meaning.en)}
                    </strong>
                    {g.formation[0] && (
                      <div className="grammar-card-formation jp">
                        {g.formation[0]}
                      </div>
                    )}
                    {ex && (
                      <div className="grammar-card-example">
                        <p className="jp" lang="ja">
                          {ex.ja}
                        </p>
                        <small>{t(ex.vi, ex.en)}</small>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    className="text-btn grammar-card-footer"
                    onClick={() => openDetail(g)}
                  >
                    <BookOpen size={15} />
                    <span>{t('Xem cách chia & ví dụ', 'Formation & examples')}</span>
                  </button>
                </article>
              );
            })}
          </div>

          {items.length > pageSize && (
            <div className="pagination">
              <span>
                {currentPage * pageSize + 1}–
                {Math.min((currentPage + 1) * pageSize, items.length)} / {items.length}{' '}
                {t('ngữ pháp', 'grammar points')}
              </span>
              <div className="row">
                <button
                  type="button"
                  className="icon-btn bordered"
                  disabled={currentPage === 0}
                  aria-label={t('Trang trước', 'Previous page')}
                  onClick={() => setPage(Math.max(0, currentPage - 1))}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="icon-btn bordered"
                  disabled={currentPage + 1 >= totalPages}
                  aria-label={t('Trang sau', 'Next page')}
                  onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Empty
          title={t('Không tìm thấy cấu trúc ngữ pháp phù hợp.', 'No matching grammar points.')}
          desc={t('Thử đổi từ khóa hoặc chọn tất cả trình độ N5–N4.', 'Try another keyword or select All N5–N4 levels.')}
        />
      )}

      {activeGrammar && (
        <GrammarDetailCard
          grammar={activeGrammar}
          close={() => setActiveGrammar(null)}
        />
      )}
    </div>
  );
}
