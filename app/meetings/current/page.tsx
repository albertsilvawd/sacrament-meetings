import { redirect } from 'next/navigation';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

function getMostRecentSunday(): string {
  const todayInWard = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date());

  const sunday = new Date(`${todayInWard}T00:00:00Z`);
  sunday.setUTCDate(sunday.getUTCDate() - sunday.getUTCDay());

  return sunday.toISOString().slice(0, 10);
}

export default async function CurrentMeetingPage() {
  const sunday = getMostRecentSunday();
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings?date=${sunday}`, { cache: 'no-store' });
  const meetings: SacramentMeeting[] = response.ok ? await response.json() : [];

  if (meetings.length === 0) {
    redirect('/meetings');
  }

  redirect(`/meetings/${meetings[0].id}`);
}