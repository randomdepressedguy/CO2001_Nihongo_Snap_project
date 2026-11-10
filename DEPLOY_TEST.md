# Đưa Nihongo Snap lên địa chỉ miễn phí để test

Phương án phù hợp với mã hiện tại là **Cloudflare Workers + D1**. Cloudflare cấp địa chỉ dạng `https://nihongo-snap-test.<ten-tai-khoan>.workers.dev`; bạn không cần mua tên miền. Bản online dùng D1 riêng, không tự lấy tài khoản hay từ đã lưu trong dữ liệu local.

## Chuẩn bị một lần

1. Tạo tài khoản Cloudflare và đăng nhập Wrangler trong terminal tại thư mục dự án:

   ```powershell
   npx wrangler login
   ```

2. Tạo database online. Ghi lại `database_id` (UUID) mà lệnh in ra:

   ```powershell
   npx wrangler d1 create nihongo-snap-test
   ```

3. Build và tạo cấu hình triển khai từ bản build. Thay `<DATABASE_ID>` bằng UUID ở bước 2:

   ```powershell
   npm run build
   npm run deploy:prepare -- <DATABASE_ID>
   ```

   Lệnh này tạo `dist/server/wrangler.test.json`, dùng D1 online và giữ cấu hình local nguyên vẹn. Có thể thêm tên model Gemini làm tham số thứ hai nếu khác mặc định `gemini-3.5-flash-lite`.

4. Tạo bảng online bằng hai migration, mỗi lệnh chỉ chạy **một lần** trên database mới:

   ```powershell
   npx wrangler d1 execute DB --remote --config dist/server/wrangler.test.json --file drizzle/0000_little_caretaker.sql
   npx wrangler d1 execute DB --remote --config dist/server/wrangler.test.json --file drizzle/0001_concerned_sally_floyd.sql
   ```

5. Đưa bản build lên mạng:

   ```powershell
   npx wrangler deploy --config dist/server/wrangler.test.json
   ```

   Wrangler sẽ in ra link `workers.dev`. Mở link đó để kiểm tra trang chủ, từ điển, đăng ký, đăng nhập, lưu một từ và tải lại trang.

6. Nếu muốn dùng **Chụp & học** và **Hana**, thêm Gemini API key dưới dạng secret; Wrangler sẽ hỏi giá trị trong terminal:

   ```powershell
   npx wrangler secret put GEMINI_API_KEY --config dist/server/wrangler.test.json
   ```

   Không dán key vào mã, Git, hoặc file cấu hình triển khai. Nếu chưa thêm key, phần học từ và lưu từ vẫn dùng được.

## Khi sửa web và muốn cập nhật bản test

```powershell
npm run build
npm run deploy:prepare -- <DATABASE_ID>
npx wrangler deploy --config dist/server/wrangler.test.json
```

Không chạy lại hai migration cũ trên database đã có bảng. `.dev.vars` và dữ liệu D1 local không được tải lên. Địa chỉ `workers.dev` có thể mở công khai; chỉ gửi link cho người test chưa phải là một lớp kiểm soát truy cập.

## Giới hạn gói miễn phí

Cloudflare Workers Free hiện giới hạn 100.000 yêu cầu/ngày và 10 ms CPU mỗi yêu cầu; D1 Free có hạn mức riêng. Mức truy cập của vài người test thường thấp, nhưng **đăng ký/đăng nhập dùng scrypt khá nặng** nên cần thử trên URL thật trước khi mời người khác. Nếu gặp lỗi CPU, giữ nguyên thuật toán mật khẩu và chọn cách triển khai khác hoặc điều chỉnh kiến trúc đăng nhập. Gemini có hạn mức riêng theo model và tài khoản API của bạn.

Tài liệu chính thức: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 setup](https://developers.cloudflare.com/d1/get-started/), [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/).
