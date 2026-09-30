export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const MOCK = [
  {
    label: 'apple',
    confidence: 0.94,
    japanese: 'りんご',
    kanji: '林檎',
    kana: 'りんご',
    romaji: 'ringo',
    vietnamese: 'quả táo',
  },
]

const PROMPT = `Bạn là từ điển ảnh Nhật-Việt. Nhìn ảnh và xác định tối đa 3 đồ vật nổi bật nhất (ưu tiên vật cụ thể, bỏ qua nền).
Chỉ trả về JSON hợp lệ, là một mảng, mỗi phần tử có đúng các trường:
"label" (tên tiếng Anh, chữ thường), "confidence" (số từ 0 đến 1),
"japanese" (từ tiếng Nhật thông dụng nhất), "kanji" (viết Kanji nếu có, nếu không thì để chuỗi rỗng),
"kana" (cách đọc bằng hiragana/katakana), "romaji", "vietnamese" (nghĩa tiếng Việt ngắn gọn).
Nếu không thấy đồ vật rõ ràng, trả về mảng rỗng [].`

async function fetchRetry(url, options, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fetch(url, { ...options, signal: AbortSignal.timeout(30_000) })
    } catch (e) {
      if (i === tries - 1) throw e
      await new Promise((r) => setTimeout(r, 1500))
    }
  }
}

export async function recognize(image) {
  const key = process.env.GEMINI_API_KEY
  if (!key || process.env.USE_MOCK === 'true') return MOCK

  const [, mime, data] = image?.match(/^data:(.+?);base64,(.+)$/) || []
  if (!data) throw new ApiError(400, 'Ảnh không hợp lệ')

  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const r = await fetchRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data } }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })

  if (r.status === 429) {
    throw new ApiError(429, 'Đang chạm giới hạn miễn phí, chờ 1-2 phút rồi thử lại.')
  }
  if (!r.ok) {
    console.error('Gemini lỗi', r.status, await r.text())
    throw new ApiError(502, `Gemini trả lỗi ${r.status} (xem log server)`)
  }

  const json = await r.json()
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  console.log('Gemini trả về:', text || JSON.stringify(json).slice(0, 500))

  const clean = text.replace(/```json|```/g, '').trim()
  let results
  try {
    results = JSON.parse(clean || '[]')
  } catch {
    throw new ApiError(502, 'Gemini trả dữ liệu không đúng định dạng, thử lại.')
  }
  return Array.isArray(results) ? results : (results.results ?? [])
}
