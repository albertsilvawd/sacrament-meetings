export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-12 print:hidden">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Nunez Ward | Sacrament Meeting Planner by Albert Silva</p>
      </div>
    </footer>
  );
}