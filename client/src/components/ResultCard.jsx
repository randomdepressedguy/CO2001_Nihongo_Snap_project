import { Volume2, BookmarkPlus } from 'lucide-react'
import { speak } from '../services/speech'

// onSave là tùy chọn: khi có thì hiện nút Lưu (nhóm Sổ tay sẽ nối vào)
export default function ResultCard({ result: r, onSave }) {
  return (
    <div className="mt-3 rounded-xl border p-4 shadow-sm">
      <p className="text-3xl font-bold">{r.japanese}</p>
      <p className="text-gray-600">{[r.kanji, r.kana, r.romaji].filter(Boolean).join(' · ')}</p>
      <p className="mt-1">{r.vietnamese}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => speak(r.japanese)}
          className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm"
        >
          <Volume2 size={16} /> Nghe
        </button>
        {onSave && (
          <button
            onClick={() => onSave(r)}
            className="flex items-center gap-1 rounded bg-red-50 px-3 py-1 text-sm text-red-600"
          >
            <BookmarkPlus size={16} /> Lưu
          </button>
        )}
      </div>
    </div>
  )
}
