'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) {
    return null;
  }

  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  const linkClass =
    'rounded border border-blue-900 px-4 py-2 font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-800';

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClass}>
          Previous<span className="sr-only"> page</span>
        </Link>
      ) : (
        <span className="w-[6.5rem]" aria-hidden="true" />
      )}
      <p className="text-sm font-medium text-gray-900">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClass}>
          Next<span className="sr-only"> page</span>
        </Link>
      ) : (
        <span className="w-[6.5rem]" aria-hidden="true" />
      )}
    </nav>
  );
}