'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/exercises', label: 'Exercises' },
    { href: '/cycles', label: 'Cycles' },
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold truncate">
            <span className="hidden sm:inline">RIR Training Tracker</span>
            <span className="sm:hidden">RIR Tracker</span>
          </Link>
          
          <nav className="flex-shrink-0">
            <ul className="flex space-x-2 sm:space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">
                      {link.label === 'Dashboard' ? 'Home' : 
                       link.label === 'Workouts' ? 'Work' :
                       link.label === 'Exercises' ? 'Exer' :
                       'Cycl'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
