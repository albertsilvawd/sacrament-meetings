import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-6">
      <Image
        src="/images/chapel.jpg"
        alt="Front view of the Nunez Ward chapel, a brick meetinghouse surrounded by trees"
        width={1846}
        height={852}
        priority
        className="h-auto w-full rounded-lg shadow-sm"
      />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sacrament Meeting Planner</h1>
        <p className="mt-2 text-lg text-gray-700">
          Plan and review sacrament meeting programs for the Nunez Ward. Members can view and print
          the program for this Sunday or any past week.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/meetings/current"
          className="rounded bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
        >
          This Sunday&apos;s program
        </Link>
        <Link
          href="/meetings"
          className="rounded border border-blue-900 px-4 py-2 font-medium text-blue-900 hover:bg-blue-50"
        >
          All meetings
        </Link>
      </div>
    </section>
  );
}