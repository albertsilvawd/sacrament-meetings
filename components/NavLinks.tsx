'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'All Meetings' },
  { href: '/meetings/current', label: 'This Sunday' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Meetings navigation" className="print:hidden">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const isActive =
            link.href === '/meetings'
              ? pathname.startsWith('/meetings')
              : pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-block rounded px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}