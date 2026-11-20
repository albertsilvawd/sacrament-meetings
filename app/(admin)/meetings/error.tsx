'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-700">
        {error.message || 'We could not complete your request. Please try again.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/meetings"
          className="rounded border border-blue-900 px-5 py-2 font-semibold text-blue-900 hover:bg-blue-50"
        >
          Back to meetings
        </Link>
      </div>
    </section>
  );
}