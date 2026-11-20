'use client';

import { deleteMeeting } from '@/lib/actions';

interface DeleteMeetingButtonProps {
  id: number;
  label: string;
}

export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteMeetingWithId}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting on ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Delete meeting on ${label}`}
        className="font-medium text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-700"
      >
        Delete
      </button>
    </form>
  );
}