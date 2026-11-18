import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.query ?? '').trim().slice(0, 100);
  const requestedPage = Math.floor(Number(searchParams?.page));
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">Sacrament Meetings</h1>
      <p className="mt-2 text-gray-700">
        Search for a meeting, then view or print its full program.
      </p>

      <div className="mt-6">
        <MeetingSearch />
      </div>

      {meetings.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <p role="status" className="mt-6 text-gray-700">
          No meetings found{query ? ` for "${query}"` : ''}.
        </p>
      )}

      <Pagination totalPages={totalPages} />
    </section>
  );
}