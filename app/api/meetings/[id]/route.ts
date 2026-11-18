import { getMeetingById } from '@/lib/meetings-db';

const MAX_POSTGRES_INT = 2147483647;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0 || meetingId > MAX_POSTGRES_INT) {
    return Response.json({ error: 'Invalid meeting id' }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return Response.json({ error: 'Meeting not found' }, { status: 404 });
  }

  return Response.json(meeting);
}