import Link from 'next/link';

export function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center py-2 bg-neutral-400 text-gray-100">
      <div>
        <span className="mx-1">Powerd by</span>
        <Link className="mx-1" href="https://nextjs.org">
          Next.js
        </Link>
        <span className="mx-1">on</span>
        <Link className="mx-1" href="https://vercel.com">
          Vercel
        </Link>
      </div>
      <div>
        <span className="text-red-500">♥</span>
        <span className="mx-1">2020-{thisYear}</span>
      </div>
    </footer>
  );
}
