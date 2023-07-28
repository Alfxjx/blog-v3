import Link from 'next/link';

export function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="flex justify-center py-2">
      <span className="mx-1">Powerd by</span>
      <Link className="mx-1" href="https://nextjs.org">
        Next.js
      </Link>
      <span className="mx-1">on</span>
      <Link className="mx-1" href="https://vercel.com">
        Vercel
      </Link>
      <span className="mx-1">with</span>
      <span className="text-red-500">♥</span>
      <span className="mx-1">2020-{thisYear}</span>
    </footer>
  );
}
