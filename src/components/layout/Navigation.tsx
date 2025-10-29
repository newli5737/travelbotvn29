'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/about', label: 'About' },
  { href: '/admin/login', label: 'Admin' },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-ocean-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">🧳 Travelbot</div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-ocean-dark'
                    : 'hover:bg-ocean-light/30'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
