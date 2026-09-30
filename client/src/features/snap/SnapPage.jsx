import { useState } from 'react'
import toast from 'react-hot-toast'
import useCamera from './useCamera'
import ResultCard from '../../components/ResultCard'
import { recognizeImage } from '../../services/api'

export default function SnapPage() {
  const { videoRef, active, error, start, capture } = useCamera()
  const [photo, setPhoto] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const recognize = async (image) => {
    setPhoto(image)
    setResults([])
    setLoading(true)
    try {
      const list = await recognizeImage(image)
      setResults(list)
      if (list.length === 0) toast('Không nhận ra đồ vật nào, thử chụp gần hơn.')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSnap = () => {
    const image = capture()
    if (image) recognize(image)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => recognize(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="w-full" />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-3 flex gap-2">
        {!active ? (
          <button onClick={start} className="flex-1 rounded-lg bg-red-600 py-2 text-white">
            Bật camera
          </button>
        ) : (
          <button
            onClick={handleSnap}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Chụp'}
          </button>
        )}
      </div>

      <input type="file" accept="image/*" onChange={handleFile} className="mt-3 block w-full text-sm" />

      {photo && <img src={photo} alt="Ảnh vừa chụp" className="mt-3 w-32 rounded-lg" />}
      {loading && <p className="mt-3 text-gray-500">Đang nhận diện...</p>}

      {/* Nhóm Sổ tay: truyền onSave={...} vào ResultCard để hiện nút Lưu */}
      {results.map((r, i) => (
        <ResultCard key={`${r.label}-${i}`} result={r} />
      ))}
    </div>
  )
}
