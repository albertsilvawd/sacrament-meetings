import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

async function fetchMeetings(): Promise<SacramentMeeting[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to load meetings');
  }

  return (await response.json()) as SacramentMeeting[];
}

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();
  const sortedMeetings = [...meetings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">Sacrament Meetings</h1>
      <p className="mt-2 text-gray-700">
        Select a meeting to view or print its full program.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sortedMeetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
}