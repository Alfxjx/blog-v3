export function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200/60 py-8 dark:border-stone-800/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          &copy; 2020&ndash;{thisYear} Alfr3d. All rights reserved.
        </p>
        <p className="text-sm text-stone-400 dark:text-stone-600">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
