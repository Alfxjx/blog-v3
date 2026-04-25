export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-accent dark:border-stone-700 dark:border-t-accent-dark" />
      <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        Loading...
      </p>
    </div>
  );
}
