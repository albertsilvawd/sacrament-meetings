import { getMeetingsByDate } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export async function GET(request: Request): Promise<Response> {
  const date = new URL(request.url).searchParams.get('date');

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Invalid date. Use YYYY-MM-DD.' }, { status: 400 });
  }

  const meetings: SacramentMeeting[] = await getMeetingsByDate(date);
  return Response.json(meetings);
}