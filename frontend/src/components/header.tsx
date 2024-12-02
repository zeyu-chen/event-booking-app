import Link from 'next/link';
import React from 'react';

function Header() {
  return (
    <header className="border-b py-3 flex flex-row justify-between">
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Events
        </Link>
        <Link
          href="/bookings"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Bookings
        </Link>
      </nav>
    </header>
  );
}

export default Header;
