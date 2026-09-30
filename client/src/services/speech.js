export function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}
