'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  tag?: string | string[];
  type?: string;
  fileType: string;
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [results, setResults] = useState<Fuse.Result<Post>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<Post> | null>(null);

  // Load posts
  useEffect(() => {
    if (!isOpen) return;
    fetch('/search.json')
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        fuseRef.current = new Fuse(data, {
          keys: ['title', 'excerpt', 'tag'],
          threshold: 0.3,
        });
      });
  }, [isOpen]);

  // Search
  useEffect(() => {
    if (!fuseRef.current || !query.trim()) {
      setResults([]);
      return;
    }
    setResults(fuseRef.current.search(query));
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) =>
          Math.min(i + 1, Math.max(results.length - 1, 0))
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = results[selectedIndex]?.item;
        if (item) {
          window.location.href = `/blogs/${item.slug}?fileType=${item.fileType}`;
        }
      }
    },
    [results, selectedIndex]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        aria-label="Search"
      >
        <FaSearch size={14} />
        <span className="hidden text-xs md:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-500 md:inline">
          Ctrl K
        </kbd>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-[20vh] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-xl overflow-hidden rounded-xl border border-stone-200 bg-[var(--bg)] shadow-2xl dark:border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-stone-100 px-4 dark:border-stone-800">
              <FaSearch size={16} className="text-stone-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search posts..."
                className="h-12 w-full bg-transparent text-stone-800 outline-none placeholder:text-stone-400 dark:text-stone-200"
              />
              <kbd className="rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-500">
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {results.length === 0 && query.trim() && (
                <div className="px-4 py-8 text-center text-sm text-stone-400 dark:text-stone-500">
                  No results found for &quot;{query}&quot;
                </div>
              )}

              {results.length > 0 && (
                <ul>
                  {results.map((result, index) => {
                    const post = result.item;
                    const isSelected = index === selectedIndex;
                    return (
                      <li key={post.slug + post.fileType}>
                        <Link
                          href={`/blogs/${post.slug}?fileType=${post.fileType}`}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-3 transition-colors ${
                            isSelected
                              ? 'bg-stone-100 dark:bg-stone-800'
                              : ''
                          }`}
                        >
                          <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                            {post.title}
                          </div>
                          {post.excerpt && (
                            <div className="mt-1 line-clamp-1 text-xs text-stone-400 dark:text-stone-500">
                              {post.excerpt}
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {results.length === 0 && !query.trim() && posts.length > 0 && (
                <div className="px-4 py-3 text-xs text-stone-400 dark:text-stone-500">
                  {posts.length} posts indexed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
