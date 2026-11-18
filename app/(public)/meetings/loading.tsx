export default function Loading() {
  return (
    <section aria-busy="true" aria-live="polite" className="animate-pulse">
      <p className="sr-only" role="status">
        Loading meetings...
      </p>
      <div className="h-9 w-64 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
      <div className="mt-6 h-10 w-full rounded bg-gray-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-36 rounded-lg border border-gray-200 bg-white p-4">
            <div className="h-3 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-6 w-56 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}