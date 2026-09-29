import { useState } from "react";
import useCamera from "./hooks/useCamera";

export default function App() {
  const { videoRef, active, error, start, capture } = useCamera();
  const [photo, setPhoto] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSnap = async () => {
    const image = capture();
    if (!image) return;
    setPhoto(image);
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results);
    } catch {
      setMsg("Có lỗi khi nhận diện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    speechSynthesis.speak(u);
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold text-red-600">Nihongo Snap</h1>

      <div className="overflow-hidden rounded-xl bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="w-full" />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-3 flex gap-2">
        {!active ? (
          <button
            onClick={start}
            className="flex-1 rounded-lg bg-red-600 py-2 text-white"
          >
            Bật camera
          </button>
        ) : (
          <button
            onClick={handleSnap}
            className="flex-1 rounded-lg bg-red-600 py-2 text-white"
          >
            Chụp
          </button>
        )}
      </div>

      {photo && (
        <img src={photo} alt="Ảnh vừa chụp" className="mt-3 w-32 rounded-lg" />
      )}
      {loading && <p className="mt-3 text-gray-500">Đang nhận diện...</p>}
      {msg && <p className="mt-3 text-red-500">{msg}</p>}

      {results.map((r) => (
        <div key={r.label} className="mt-3 rounded-xl border p-4 shadow-sm">
          <p className="text-3xl font-bold">{r.japanese}</p>
          <p className="text-gray-600">
            {r.kanji} · {r.kana} · {r.romaji}
          </p>
          <p className="mt-1">{r.vietnamese}</p>
          <button
            onClick={() => speak(r.japanese)}
            className="mt-2 rounded bg-gray-100 px-3 py-1 text-sm"
          >
            🔊 Nghe
          </button>
        </div>
      ))}
    </div>
  );
}
