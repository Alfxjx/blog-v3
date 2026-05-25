'use client';

import { useEffect, useState, useCallback } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

function useToc(headings: Heading[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return { activeId, scrollTo };
}

/* ------------------------------------------------------------------ */
/* Desktop fixed sidebar                                               */
/* ------------------------------------------------------------------ */

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const { activeId, scrollTo } = useToc(headings);

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
        On this page
      </div>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(heading.id);
              }}
              className={[
                'block border-l-2 py-1 pl-3 text-xs leading-relaxed transition-colors',
                activeId === heading.id
                  ? 'border-accent text-accent dark:border-accent-dark dark:text-accent-dark'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200',
              ].join(' ')}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile collapsible panel                                            */
/* ------------------------------------------------------------------ */

export function MobileTableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const { activeId, scrollTo } = useToc(headings);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    scrollTo(id);
    setOpen(false);
  };

  return (
    <div className="xl:hidden sticky top-18 z-40 -mx-4 mb-6 border-b border-stone-100 bg-(--bg) px-4 py-3 dark:border-stone-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        <span>目录</span>
        <svg
          className={`h-4 w-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="mt-2 max-h-[60vh] space-y-1 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(heading.id);
                }}
                className={[
                  'block rounded px-3 py-1.5 text-sm transition-colors',
                  activeId === heading.id
                    ? 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                    : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100',
                ].join(' ')}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
