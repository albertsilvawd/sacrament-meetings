import Link from 'next/link';
import type { MeetingType, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/format';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

const typeLabels: Record<MeetingType, string> = {
  regular: 'Sacrament Meeting',
  testimony: 'Fast and Testimony Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">
        {typeLabels[meeting.meetingType]}
      </p>
      <h2 className="mt-1 text-xl font-bold text-gray-900">
        {formatMeetingDate(meeting.date)}
      </h2>
      <p className="mt-2 text-gray-700">
        Conducting: {meeting.conducting}
      </p>
      <p className="text-gray-700">
        {speakerCount} {speakerCount === 1 ? 'speaker' : 'speakers'}
      </p>
      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-3 inline-block font-medium text-blue-800 underline hover:text-blue-600"
      >
        View program<span className="sr-only"> for {formatMeetingDate(meeting.date)}</span>
      </Link>
    </article>
  );
}