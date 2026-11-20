import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <section className="py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Meeting not found</h1>
      <p className="mt-2 text-gray-700">
        We couldn&apos;t find the meeting you are trying to edit. It may have been deleted.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-block rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Back to meetings
      </Link>
    </section>
  );
}