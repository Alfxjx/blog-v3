import React, { HTMLAttributes } from 'react';

export function Tag({
  children,
  className,
  ...props
}: { children: React.ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-block rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
