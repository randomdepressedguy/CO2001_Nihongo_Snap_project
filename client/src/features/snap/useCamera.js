import { useRef, useState, useCallback, useEffect } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(false)

  const start = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setActive(true)
    } catch (e) {
      console.error('Lỗi camera:', e)
      setError('Không mở được camera. Hãy cấp quyền camera cho trình duyệt.')
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setActive(false)
  }, [])

  // Chụp một khung hình, nén tối đa 800px, trả về base64 JPEG
  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return null
    const scale = Math.min(1, 800 / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth * scale
    canvas.height = video.videoHeight * scale
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.7)
  }, [])

  useEffect(() => stop, [stop])

  return { videoRef, active, error, start, stop, capture }
}
