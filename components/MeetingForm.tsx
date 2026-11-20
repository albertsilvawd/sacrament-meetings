'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { MeetingFormState } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

type FormValues = NonNullable<MeetingFormState['values']>;
type FieldName = keyof FormValues;

interface MeetingFormProps {
  action: (state: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

// Turns a saved meeting into the text values shown in the form
function toFormValues(meeting?: SacramentMeeting): FormValues {
  if (!meeting) {
    return { meetingType: 'regular', stakeBusiness: false };
  }
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join('\n'),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers
      .map((s) => `${s.name} | ${s.topic}${s.type === 'musical-number' ? ' | music' : ''}`)
      .join('\n'),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

const inputClass =
  'w-full rounded border border-gray-400 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 aria-[invalid=true]:border-red-700';
const labelClass = 'mb-1 block text-sm font-semibold text-gray-900';

// Declared outside MeetingForm, so React does not recreate it on every render
function ErrorText({ name, errors }: { name: FieldName; errors?: string[] }) {
  return (
    <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, { message: null, errors: {} });
  const values = state.values ?? toFormValues(meeting);

  const text = (name: FieldName) => {
    const value = values[name];
    return typeof value === 'string' ? value : '';
  };

  // Shared props that connect each input to its label and its error message
  const fieldProps = (name: FieldName) => ({
    id: name,
    name,
    'aria-describedby': `${name}-error`,
    'aria-invalid': Boolean(state.errors?.[name]),
  });

  const textField = (name: FieldName, label: string, type: string = 'text') => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input type={type} defaultValue={text(name)} className={inputClass} {...fieldProps(name)} />
      <ErrorText name={name} errors={state.errors?.[name]} />
    </div>
  );

  const hymnFields = (prefix: 'opening' | 'sacrament' | 'closing', label: string) => (
    <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
      {textField(`${prefix}HymnNumber` as FieldName, `${label} hymn number`, 'number')}
      {textField(`${prefix}HymnTitle` as FieldName, `${label} hymn title`)}
    </div>
  );

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded border border-red-300 bg-red-50 px-4 py-3 font-medium text-red-800">
            {state.message}
          </p>
        )}
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-xl font-bold text-gray-900">Meeting details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {textField('date', 'Date', 'date')}
          <div>
            <label htmlFor="meetingType" className={labelClass}>
              Meeting type
            </label>
            <select defaultValue={text('meetingType')} className={inputClass} {...fieldProps('meetingType')}>
              <option value="regular">Sacrament meeting</option>
              <option value="testimony">Fast and testimony meeting</option>
              <option value="stake">Stake conference</option>
              <option value="general">General conference</option>
            </select>
            <ErrorText name="meetingType" errors={state.errors?.meetingType} />
          </div>
          {textField('presiding', 'Presiding')}
          {textField('conducting', 'Conducting')}
        </div>
        <div>
          <label htmlFor="announcements" className={labelClass}>
            Announcements (one per line, optional)
          </label>
          <textarea rows={3} defaultValue={text('announcements')} className={inputClass} {...fieldProps('announcements')} />
          <ErrorText name="announcements" errors={state.errors?.announcements} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-xl font-bold text-gray-900">Program</legend>
        {hymnFields('opening', 'Opening')}
        {textField('openingPrayer', 'Opening prayer')}
        <div>
          <label htmlFor="wardBusiness" className={labelClass}>
            Ward business (one item per line, optional)
          </label>
          <textarea rows={3} defaultValue={text('wardBusiness')} className={inputClass} {...fieldProps('wardBusiness')} />
          <ErrorText name="wardBusiness" errors={state.errors?.wardBusiness} />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness === true}
            className="h-5 w-5 accent-blue-800"
          />
          <label htmlFor="stakeBusiness" className="font-semibold text-gray-900">
            Stake business this week
          </label>
        </div>
        {hymnFields('sacrament', 'Sacrament')}
        <div>
          <label htmlFor="speakers" className={labelClass}>
            Speakers (one per line: Name | Topic, add &quot;| music&quot; for a musical number)
          </label>
          <textarea rows={4} defaultValue={text('speakers')} className={inputClass} {...fieldProps('speakers')} />
          <ErrorText name="speakers" errors={state.errors?.speakers} />
        </div>
        {hymnFields('closing', 'Closing')}
        {textField('closingPrayer', 'Closing prayer')}
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-60"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <Link href="/meetings" className="font-medium text-blue-800 underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}