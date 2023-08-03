import Link from 'next/link';
import { ThemeToggle } from '../theme/theme-toggle';
import { HomeLink, BlogLink, AboutLink, ShortLink } from './Header';

export function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center py-2 bg-neutral-200 text-gray-700 dark:bg-neutral-700 dark:text-gray-200 text-sm">
      <div>
        <span className="mx-1">Powerd by</span>
        <Link className="mx-1" href="https://nextjs.org">
          Next.js
        </Link>
        <span className="mx-1">on</span>
        <Link className="mx-1" href="https://vercel.com">
          Vercel
        </Link>
        <span className="text-red-500">♥</span>
        <span className="mx-1">2020-{thisYear}</span>
      </div>
      <div className="flex items-center">
        <HomeLink></HomeLink>
        <BlogLink></BlogLink>
        <AboutLink></AboutLink>
        <ShortLink></ShortLink>
        <span className="ml-2">
          <ThemeToggle />
        </span>
      </div>
    </footer>
  );
}
