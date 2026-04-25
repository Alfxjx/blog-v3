import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-serif text-6xl font-medium text-stone-800 dark:text-stone-100 md:text-8xl">
        404
      </h1>
      <p className="mt-4 text-lg text-stone-500 dark:text-stone-400">
        Page not found
      </p>
      <p className="mt-2 text-sm text-stone-400 dark:text-stone-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-6 py-2.5 text-sm font-medium text-stone-700 transition-all hover:border-accent hover:bg-accent hover:text-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-accent-dark dark:hover:bg-accent-dark dark:hover:text-stone-950"
      >
        ← Back to home
      </Link>
    </div>
  );
}
