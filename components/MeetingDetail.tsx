import type { Hymn, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/format';
import PrintButton from './PrintButton';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function formatHymn(hymn: Hymn): string {
  return hymn.number > 0 ? `#${hymn.number} – ${hymn.title}` : hymn.title;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">
            Nunez Ward · {meeting.meetingType} meeting
          </p>
          <h1 className="text-3xl font-bold text-gray-900">{formatMeetingDate(meeting.date)}</h1>
        </div>
        <PrintButton />
      </header>

      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
        <dt className="font-semibold text-gray-900">Presiding</dt>
        <dd className="text-gray-700">{meeting.presiding}</dd>
        <dt className="font-semibold text-gray-900">Conducting</dt>
        <dd className="text-gray-700">{meeting.conducting}</dd>
      </dl>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700">
            {meeting.announcements.map((announcement) => (
              <li key={announcement}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Program</h2>
        <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
          <dt className="font-semibold text-gray-900">Opening Hymn</dt>
          <dd className="text-gray-700">{formatHymn(meeting.openingHymn)}</dd>

          <dt className="font-semibold text-gray-900">Opening Prayer</dt>
          <dd className="text-gray-700">{meeting.openingPrayer}</dd>

          <dt className="font-semibold text-gray-900">Ward Business</dt>
          <dd className="text-gray-700">
            {meeting.wardBusiness.length > 0
              ? meeting.wardBusiness.map((item) => item.description).join('; ')
              : 'None'}
          </dd>

          <dt className="font-semibold text-gray-900">Stake Business</dt>
          <dd className="text-gray-700">{meeting.stakeBusiness ? 'Yes' : 'No'}</dd>

          <dt className="font-semibold text-gray-900">Sacrament Hymn</dt>
          <dd className="text-gray-700">{formatHymn(meeting.sacramentHymn)}</dd>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Speakers and Musical Numbers</h2>
        {meeting.speakers.length > 0 ? (
          <ol className="mt-2 list-decimal pl-6 text-gray-700">
            {meeting.speakers.map((item) => (
              <li key={`${item.type}-${item.name}`}>
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.type === 'musical-number' ? ' (musical number)' : ''}
                {item.topic && ` – ${item.topic}`}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-gray-700">
            {meeting.meetingType === 'testimony'
              ? 'Members are invited to share their testimonies.'
              : 'No speakers scheduled.'}
          </p>
        )}
      </section>

      <section className="mt-6">
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
          <dt className="font-semibold text-gray-900">Closing Hymn</dt>
          <dd className="text-gray-700">{formatHymn(meeting.closingHymn)}</dd>

          <dt className="font-semibold text-gray-900">Closing Prayer</dt>
          <dd className="text-gray-700">{meeting.closingPrayer}</dd>
        </dl>
      </section>
    </article>
  );
}