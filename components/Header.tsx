import Link from 'next/link';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  return (
    <header className="bg-blue-900 text-white shadow-md print:hidden">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-2xl font-bold">
          Nunez Ward
        </Link>
        <p className="text-sm text-blue-100">{today}</p>
      </div>
    </header>
  );
}