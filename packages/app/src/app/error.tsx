'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-serif text-4xl font-medium text-stone-800 dark:text-stone-100 md:text-6xl">
        Oops
      </h1>
      <p className="mt-4 text-lg text-stone-500 dark:text-stone-400">
        Something went wrong
      </p>
      <p className="mt-2 max-w-md text-sm text-stone-400 dark:text-stone-500">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-6 py-2.5 text-sm font-medium text-stone-700 transition-all hover:border-accent hover:bg-accent hover:text-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-accent-dark dark:hover:bg-accent-dark dark:hover:text-stone-950"
      >
        Try again
      </button>
    </div>
  );
}
