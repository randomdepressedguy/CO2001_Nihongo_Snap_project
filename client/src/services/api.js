export async function recognizeImage(image) {
  const res = await fetch('/api/recognize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  })
  const raw = await res.text()
  let data = {}
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    throw new Error(`Server trả dữ liệu lạ (mã ${res.status})`)
  }
  if (!res.ok) {
    throw new Error(data.error || `Không kết nối được server (mã ${res.status}).`)
  }
  return data.results ?? []
}
