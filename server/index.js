import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/api", rateLimit({ windowMs: 60_000, limit: 30 }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/recognize", (req, res) => {
  res.json({
    results: [
      {
        label: "apple",
        confidence: 0.94,
        japanese: "りんご",
        kanji: "林檎",
        kana: "りんご",
        romaji: "ringo",
        vietnamese: "quả táo",
      },
    ],
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server chạy ở http://localhost:${PORT}`));
