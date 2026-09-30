import { Router } from 'express'
import { recognize, ApiError } from '../services/vision.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const results = await recognize(req.body?.image)
    res.json({ results })
  } catch (e) {
    console.error('Lỗi nhận diện:', e)
    if (e instanceof ApiError) return res.status(e.status).json({ error: e.message })
    const msg =
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT'
        ? 'Không kết nối được tới Google (mạng chặn/chập chờn). Thử đổi mạng hoặc bật USE_MOCK=true.'
        : e.name === 'TimeoutError'
          ? 'Gemini phản hồi quá lâu, thử lại.'
          : `Lỗi server: ${e.message}`
    res.status(500).json({ error: msg })
  }
})

export default router
