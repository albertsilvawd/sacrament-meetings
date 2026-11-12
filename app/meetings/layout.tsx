import NavLinks from '@/components/NavLinks';

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <NavLinks />
      {children}
    </div>
  );
}