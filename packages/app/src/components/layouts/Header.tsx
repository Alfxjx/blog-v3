import { LinkButton } from '../links/base';
import { caveat } from './fonts';
import Link from 'next/link';
import { ThemeToggle } from '../theme/theme-toggle';
import { Search } from '../search';

const navLinks = [
  { href: '/blogs', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/short', label: 'Short' },
];

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/50 bg-[var(--bg)]/80 backdrop-blur-md transition-colors dark:border-stone-800/50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className={`text-xl font-bold tracking-tight ${caveat.className}`}>
          Alfr3d
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <LinkButton key={link.href} href={link.href} label={link.label} />
          ))}
          <div className="ml-2">
            <Search />
          </div>
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

export { Header };
