# Nihongo Snap 📸🇯🇵

**Học từ vựng tiếng Nhật qua ống kính.**
Chụp một đồ vật xung quanh, nhận ngay từ tiếng Nhật kèm cách đọc, nghĩa tiếng Việt và phát âm.

> Đồ án môn **CO2001** — Nhóm 8
> Thành viên: Khánh Vy, Huy Văn, Ngọc Lợi, Tấn Đạt

<!-- Thêm ảnh chụp màn hình khi có: -->
<!-- ![Demo](docs/demo.png) -->

---

## Ý tưởng

Khi học tiếng Nhật, ta thường gặp đồ vật quen thuộc nhưng không biết gọi tên bằng tiếng Nhật. Tra từ điển truyền thống đòi hỏi phải biết tên đồ vật trước, và từ vựng dễ bị nhớ rời rạc, tách khỏi hình ảnh thực tế.

**Nihongo Snap** đảo ngược quy trình: người học chỉ cần **chụp ảnh**, hệ thống nhận diện đồ vật rồi tra từ tiếng Nhật tương ứng. Quá trình *nhìn thấy → tra cứu → ghi nhớ* trở nên trực tiếp, gắn với đời sống hằng ngày.

## Luồng hoạt động

```
Chụp ảnh → Nhận diện hình ảnh → Tra từ tiếng Nhật → Hiển thị + phát âm → Lưu flashcard → Ôn tập
```

1. **Chụp ảnh** bằng camera của trình duyệt (hoặc chọn ảnh từ máy). Ảnh được nén ở client trước khi gửi.
2. **Nhận diện + tra từ**: backend gửi ảnh tới Gemini API, nhận về danh sách đồ vật kèm từ tiếng Nhật.
3. **Hiển thị** thẻ từ vựng: từ tiếng Nhật, Kanji, Kana, Romaji, nghĩa tiếng Việt.
4. **Phát âm** bằng Web Speech API của trình duyệt.
5. **Lưu** thành flashcard trong Sổ tay (LocalStorage) để ôn tập sau.

## Trạng thái tính năng

| Tính năng | Trạng thái |
|---|---|
| Chụp ảnh / chọn ảnh, nhận diện bằng Gemini | ✅ Hoạt động |
| Thẻ từ vựng (Kanji, Kana, Romaji, nghĩa Việt) + phát âm | ✅ Hoạt động |
| Sổ tay flashcard (lưu LocalStorage) | 🚧 Đang phát triển |
| Ôn tập (lật thẻ) | 🚧 Đang phát triển |
| Tra từ bằng chữ | 🚧 Đang phát triển |
| Bài học theo trình độ N5–N1, mẫu câu, ngữ pháp | 📝 Dự kiến |
| Gia sư AI | 📝 Dự kiến |

Hướng mở rộng xa hơn: dịch văn bản từ ảnh (OCR), nhận diện và luyện viết Kanji, ôn tập thông minh dựa trên lịch sử học, đánh giá phát âm.

## Công nghệ

| Phần | Công nghệ |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Nhận diện hình ảnh + tra từ | Gemini API (key được giữ ở phía server) |
| Phát âm | Web Speech API |
| Lưu trữ | LocalStorage |

Dự án tập trung vào **tích hợp dịch vụ có sẵn**, không tự huấn luyện mô hình Computer Vision.

## Bắt đầu nhanh

### Yêu cầu

- [Node.js](https://nodejs.org) bản LTS (20.19+ hoặc 22.12+)
- [Git](https://git-scm.com)
- Trình duyệt hiện đại có hỗ trợ camera (Chrome, Edge, Safari)
- API key Gemini (miễn phí) tại [Google AI Studio](https://aistudio.google.com)

### Cài đặt

```bash
git clone https://github.com/randomdepressedguy/CO2001_Nihongo_Snap_project.git
cd CO2001_Nihongo_Snap_project
npm run install:all
```

Tạo file cấu hình server:

```bash
# macOS/Linux
cp server/.env.example server/.env
# Windows PowerShell
Copy-Item server/.env.example server/.env
```

Mở `server/.env` và điền:

```
PORT=3001
GEMINI_API_KEY=key_cua_ban
GEMINI_MODEL=gemini-flash-lite-latest
USE_MOCK=false
```

> Chưa có key hoặc mạng tới Google bị lỗi: đặt `USE_MOCK=true` để server trả dữ liệu mẫu.
> **Không commit file `.env`** (đã nằm trong `.gitignore`).

### Chạy

```bash
npm run dev
```

- Giao diện: http://localhost:5173
- Kiểm tra server: http://localhost:3001/api/health → `{"ok":true}`

Camera trình duyệt chỉ hoạt động trên `localhost` hoặc HTTPS. Muốn thử trên điện thoại, cần deploy hoặc dùng tunnel (ví dụ ngrok).

## Cấu trúc dự án

```
nihongo_snap/
├── client/                 # React + Vite (cổng 5173)
│   └── src/
│       ├── config/         # features.js: danh sách tính năng
│       ├── components/     # Layout, ResultCard, ComingSoon
│       ├── services/       # api.js, speech.js
│       └── features/       # snap, notebook, review, dictionary, lessons, tutor
├── server/                 # Express (cổng 3001)
│   ├── index.js
│   ├── routes/             # recognize.js
│   └── services/           # vision.js (gọi Gemini)
├── AI_CONTEXT.md           # ngữ cảnh dự án dành cho AI khi vibe code
├── HUONG_DAN_REPO.md       # hướng dẫn làm việc nhóm với Git
└── package.json            # script chạy chung
```

Thêm một tính năng mới chỉ cần tạo thư mục trong `client/src/features/` và thêm **một dòng** vào `client/src/config/features.js`.

## API

`POST /api/recognize`

```json
// Request
{ "image": "data:image/jpeg;base64,..." }

// Response
{
  "results": [
    {
      "label": "apple",
      "confidence": 0.94,
      "japanese": "りんご",
      "kanji": "林檎",
      "kana": "りんご",
      "romaji": "ringo",
      "vietnamese": "quả táo"
    }
  ]
}
```

Lỗi trả về dạng `{ "error": "thông báo" }` kèm mã HTTP tương ứng.

## Làm việc nhóm

- Nhánh `main` được bảo vệ: **không push thẳng**, mọi thay đổi đi qua Pull Request và cần người duyệt.
- Mỗi việc làm trên một nhánh riêng (`feature/...`, `fix/...`, `chore/...`).
- Chi tiết quy trình, xử lý xung đột và sự cố thường gặp: xem [`HUONG_DAN_REPO.md`](HUONG_DAN_REPO.md).
- Cấu trúc và các lưu ý kỹ thuật (dành cho cả người và AI): xem [`AI_CONTEXT.md`](AI_CONTEXT.md).

## Lưu ý khi dùng bản miễn phí của Gemini

- Có giới hạn số request theo phút và theo ngày; gặp lỗi 429 thì chờ 1–2 phút.
- Dữ liệu gửi lên bản miễn phí có thể được dùng để cải thiện mô hình, vì vậy khi thử nên dùng ảnh đồ vật, tránh ảnh có mặt người hoặc thông tin cá nhân.
- Tên model có thể thay đổi theo thời gian; chỉnh `GEMINI_MODEL` trong `server/.env` nếu gặp lỗi 404.

## Giấy phép

Dự án phục vụ mục đích học tập trong khuôn khổ môn CO2001, chưa có giấy phép phân phối riêng.
