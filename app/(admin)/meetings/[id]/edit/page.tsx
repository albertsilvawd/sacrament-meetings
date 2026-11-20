import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';

export const metadata: Metadata = { title: 'Edit Meeting' };

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0 || meetingId > 2147483647) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    notFound();
  }

  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">Edit Meeting</h1>
      <p className="mt-2 text-gray-700">Update the program for {meeting.date}.</p>
      <div className="mt-6">
        <MeetingForm action={updateMeetingWithId} meeting={meeting} submitLabel="Save changes" />
      </div>
    </section>
  );
}