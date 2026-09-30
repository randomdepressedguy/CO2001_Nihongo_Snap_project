export default function ComingSoon({ title, desc }) {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
      <p className="mt-3 text-xs text-gray-400">Đang phát triển</p>
    </div>
  )
}
