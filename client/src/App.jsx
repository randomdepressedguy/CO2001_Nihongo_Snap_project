import { useState } from "react";
import useCamera from "./hooks/useCamera";

export default function App() {
  const { videoRef, active, error, start, capture } = useCamera();
  const [photo, setPhoto] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const recognize = async (image) => {
    setPhoto(image);
    setLoading(true);
    setMsg("");
    setResults([]);
    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(`Server trả dữ liệu lạ (mã ${res.status})`);
      }
      if (!res.ok)
        throw new Error(
          data.error ||
            `Không kết nối được server (mã ${res.status}). Xem terminal server.`,
        );
      setResults(data.results);
      if (data.results.length === 0)
        setMsg("Không nhận ra đồ vật nào, thử chụp gần hơn.");
    } catch (e) {
      setMsg(e.message || "Có lỗi khi nhận diện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnap = () => {
    const image = capture();
    if (image) recognize(image);
  };

  // Test bằng ảnh có sẵn trong máy (không cần camera)
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => recognize(reader.result);
    reader.readAsDataURL(file);
    e.target.value = ""; // cho phép chọn lại cùng một ảnh
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
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Chụp"}
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mt-3 block w-full text-sm"
      />

      {photo && (
        <img src={photo} alt="Ảnh vừa chụp" className="mt-3 w-32 rounded-lg" />
      )}
      {loading && <p className="mt-3 text-gray-500">Đang nhận diện...</p>}
      {msg && <p className="mt-3 text-red-500">{msg}</p>}

      {results.map((r, i) => (
        <div
          key={`${r.label}-${i}`}
          className="mt-3 rounded-xl border p-4 shadow-sm"
        >
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
