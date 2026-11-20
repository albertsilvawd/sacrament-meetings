import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = { title: 'Create Meeting' };

export default function NewMeetingPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">Create Meeting</h1>
      <p className="mt-2 text-gray-700">Fill in the program for a new sacrament meeting.</p>
      <div className="mt-6">
        <MeetingForm action={createMeeting} submitLabel="Create meeting" />
      </div>
    </section>
  );
}