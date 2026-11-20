'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingFromDb,
} from './meetings-db';
import type { SacramentMeeting } from './types';

// Splits a textarea into one item per non-empty line
function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const requiredText = (message: string) => z.string().trim().min(2, message).max(255);

const hymnNumber = z
  .string()
  .trim()
  .regex(/^\d{1,4}$/, 'Enter a hymn number (use 0 if there is no hymn).')
  .transform(Number);

const MeetingFormSchema = z.object({
  date: z.string().refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Choose a valid date.'),
  meetingType: z.enum(['regular', 'testimony', 'stake', 'general'], {
    message: 'Choose a meeting type.',
  }),
  presiding: requiredText('Enter who is presiding.'),
  conducting: requiredText('Enter who is conducting.'),
  announcements: z.string().max(2000, 'Announcements are too long.'),
  openingHymnNumber: hymnNumber,
  openingHymnTitle: requiredText('Enter the opening hymn title.'),
  openingPrayer: requiredText('Enter who gives the opening prayer.'),
  wardBusiness: z.string().max(2000, 'Ward business is too long.'),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber,
  sacramentHymnTitle: requiredText('Enter the sacrament hymn title.'),
  speakers: z
    .string()
    .max(3000, 'The speakers list is too long.')
    .refine(
      (value) =>
        toLines(value).every((line) => {
          const [name, topic] = line.split('|').map((part) => part.trim());
          return Boolean(name) && Boolean(topic);
        }),
      'Write each speaker on its own line as "Name | Topic" (add "| music" for a musical number).'
    ),
  closingHymnNumber: hymnNumber,
  closingHymnTitle: requiredText('Enter the closing hymn title.'),
  closingPrayer: requiredText('Enter who gives the closing prayer.'),
});

type MeetingFormValues = z.input<typeof MeetingFormSchema>;
type MeetingField = keyof MeetingFormValues;

export type MeetingFormState = {
  message?: string | null;
  errors?: Partial<Record<MeetingField, string[]>>;
  values?: Partial<Record<MeetingField, string | boolean>>;
};

// Reads the raw form values (FormData values are untyped)
function readForm(formData: FormData): MeetingFormValues {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === 'string' ? value : '';
  };

  return {
    date: text('date'),
    meetingType: text('meetingType') as MeetingFormValues['meetingType'],
    presiding: text('presiding'),
    conducting: text('conducting'),
    announcements: text('announcements'),
    openingHymnNumber: text('openingHymnNumber'),
    openingHymnTitle: text('openingHymnTitle'),
    openingPrayer: text('openingPrayer'),
    wardBusiness: text('wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymnNumber: text('sacramentHymnNumber'),
    sacramentHymnTitle: text('sacramentHymnTitle'),
    speakers: text('speakers'),
    closingHymnNumber: text('closingHymnNumber'),
    closingHymnTitle: text('closingHymnTitle'),
    closingPrayer: text('closingPrayer'),
  };
}

// Converts the validated form data into the shape stored in the database
function toMeeting(data: z.output<typeof MeetingFormSchema>): Omit<SacramentMeeting, 'id'> {
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: toLines(data.announcements),
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: toLines(data.wardBusiness).map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
    speakers: toLines(data.speakers).map((line) => {
      const [name, topic, kind] = line.split('|').map((part) => part.trim());
      return {
        name,
        topic,
        type: kind?.toLowerCase() === 'music' ? 'musical-number' : 'speaker',
      };
    }),
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

function isDuplicateDate(error: unknown): boolean {
  // 23505 = unique_violation (another meeting already uses this date)
  return (error as { code?: string }).code === '23505';
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const values = readForm(formData);
  const parsed = MeetingFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await addMeeting(toMeeting(parsed.data));
  } catch (error) {
    if (isDuplicateDate(error)) {
      const message = 'A meeting already exists for this date.';
      return { message, errors: { date: [message] }, values };
    }
    console.error('Failed to create meeting:', error);
    throw new Error('Failed to create the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const values = readForm(formData);
  const parsed = MeetingFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    const updated = await updateMeetingInDb(id, toMeeting(parsed.data));
    if (!updated) {
      return { message: 'This meeting no longer exists.', values };
    }
  } catch (error) {
    if (isDuplicateDate(error)) {
      const message = 'Another meeting already exists for this date.';
      return { message, errors: { date: [message] }, values };
    }
    console.error('Failed to update meeting:', error);
    throw new Error('Failed to update the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect(`/meetings/${id}`);
}

export async function deleteMeeting(id: number): Promise<void> {
  try {
    await deleteMeetingFromDb(id);
  } catch (error) {
    console.error('Failed to delete meeting:', error);
    throw new Error('Failed to delete the meeting. Please try again.');
  }

  revalidatePath('/meetings');
}