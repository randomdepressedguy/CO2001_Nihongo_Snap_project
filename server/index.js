import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/api", rateLimit({ windowMs: 60_000, limit: 20 }));

const MOCK = [
  {
    label: "apple",
    confidence: 0.94,
    japanese: "りんご",
    kanji: "林檎",
    kana: "りんご",
    romaji: "ringo",
    vietnamese: "quả táo",
  },
];

const PROMPT = `Bạn là từ điển ảnh Nhật-Việt. Nhìn ảnh và xác định tối đa 3 đồ vật nổi bật nhất (ưu tiên vật cụ thể, bỏ qua nền).
Chỉ trả về JSON hợp lệ, là một mảng, mỗi phần tử có đúng các trường:
"label" (tên tiếng Anh, chữ thường), "confidence" (số từ 0 đến 1),
"japanese" (từ tiếng Nhật thông dụng nhất), "kanji" (viết Kanji nếu có, nếu không thì để chuỗi rỗng),
"kana" (cách đọc bằng hiragana/katakana), "romaji", "vietnamese" (nghĩa tiếng Việt ngắn gọn).
Nếu không thấy đồ vật rõ ràng, trả về mảng rỗng [].`;

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/recognize", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.json({ results: MOCK, mock: true });

  try {
    const image = req.body?.image;
    if (!image) return res.status(400).json({ error: "Thiếu ảnh" });

    // image dạng "data:image/jpeg;base64,xxxx"
    const [, mime, data] = image.match(/^data:(.+?);base64,(.+)$/) || [];
    if (!data) return res.status(400).json({ error: "Ảnh không hợp lệ" });

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: mime, data } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (r.status === 429) {
      return res.status(429).json({
        error: "Đang chạm giới hạn miễn phí, chờ 1-2 phút rồi thử lại.",
      });
    }
    if (!r.ok) {
      console.error("Gemini lỗi", r.status, await r.text());
      return res
        .status(502)
        .json({ error: `Gemini trả lỗi ${r.status} (xem log server)` });
    }

    const json = await r.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    console.log("Gemini trả về:", text);
    const results = JSON.parse(text);
    res.json({ results: Array.isArray(results) ? results : [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi nhận diện" });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server chạy ở http://localhost:${PORT}`);
});
server.on("error", (err) => {
  console.error("Không khởi động được server:", err.message);
  process.exit(1);
});
