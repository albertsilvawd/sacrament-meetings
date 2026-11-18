export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">
        Edit Meeting #{id} — Coming in Week 04
      </h1>
      <p className="mt-2 text-gray-700">
        A form to edit this meeting program will be available here.
      </p>
    </section>
  );
}