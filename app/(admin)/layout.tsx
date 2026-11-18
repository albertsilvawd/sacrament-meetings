import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
        <p className="font-semibold text-amber-900">Leader tools</p>
        <p className="text-sm text-amber-900">
          These pages are for bishopric members. Sign-in will be added in Week 05.
        </p>
      </div>
      <nav aria-label="Leader navigation" className="flex flex-wrap gap-4">
        <Link href="/meetings" className="font-medium text-blue-800 underline">
          Back to meetings
        </Link>
        <Link href="/meetings/new" className="font-medium text-blue-800 underline">
          Create meeting
        </Link>
      </nav>
      {children}
    </div>
  );
}