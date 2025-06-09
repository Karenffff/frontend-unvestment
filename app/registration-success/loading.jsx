export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="animate-pulse">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-700"></div>
          <div className="h-6 bg-zinc-700 rounded mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-16 bg-zinc-700 rounded"></div>
            <div className="h-12 bg-zinc-700 rounded"></div>
            <div className="h-10 bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
