import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

async function fetchMeeting(id: string): Promise<SacramentMeeting | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings/${id}`, { cache: 'no-store' });

  if (response.status === 400 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load meeting');
  }

  return (await response.json()) as SacramentMeeting;
}

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = await fetchMeeting(id);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}