"use client"

export default function CollectionsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Something went wrong loading collections.</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button
        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
