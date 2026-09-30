import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import recognizeRoute from './routes/recognize.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use('/api', rateLimit({ windowMs: 60_000, limit: 20 }))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/recognize', recognizeRoute)
// Tính năng mới: app.use('/api/dictionary', dictionaryRoute)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT)
server.on('listening', () => console.log(`Server chạy ở http://localhost:${PORT}`))
server.on('error', (err) => {
  console.error('Không khởi động được server:', err.message)
  process.exit(1)
})
