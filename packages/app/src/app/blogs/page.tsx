import { markdownReader } from '@/utils';
import { FileKeys, formatDate } from '@/core';
import Link from 'next/link';
import { FadeIn, StaggerItem } from '@/components/animated-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Writings',
  description: 'Browse all blog posts about technology, travel, and life.',
};

export default async function Blogs() {
  const files = await getData();
  const grouped = groupByYear(files);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="pb-24">
      <FadeIn>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-800 dark:text-stone-100 md:text-4xl">
          All Writings
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Thoughts on technology, travel, and life.
        </p>
      </FadeIn>

      <div className="relative mt-16">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800 md:left-6" />

        <div className="flex flex-col gap-12">
          {years.map((year, yearIndex) => (
            <FadeIn key={year} delay={yearIndex * 0.1}>
              <section className="relative">
                {/* Year node */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-300 bg-[var(--bg)] dark:border-stone-700 md:h-12 md:w-12">
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 md:text-sm">
                      {year.slice(2)}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-medium text-stone-800 dark:text-stone-100">
                    {year}
                  </h2>
                  <span className="text-sm text-stone-400 dark:text-stone-500">
                    {grouped[year].length} posts
                  </span>
                </div>

                {/* Posts under this year */}
                <div className="ml-4 mt-4 flex flex-col gap-0 md:ml-6">
                  {grouped[year].map((post, i) => (
                    <StaggerItem key={post.slug} delay={i * 0.05}>
                      <article className="group relative flex gap-4 py-4 md:gap-6">
                        {/* Date dot on timeline */}
                        <div className="relative flex w-8 shrink-0 justify-center md:w-12">
                          <div className="absolute top-[1.35rem] h-2 w-2 rounded-full bg-stone-300 transition-colors group-hover:bg-accent dark:bg-stone-700 dark:group-hover:bg-accent-dark md:top-[1.45rem]" />
                        </div>

                        {/* Post card */}
                        <Link
                          href={`/blogs/${post.slug}?fileType=${post.fileType}`}
                          className="flex flex-1 flex-col gap-1 rounded-xl border border-transparent px-3 py-2 transition-all hover:border-stone-200 hover:bg-stone-50 dark:hover:border-stone-800 dark:hover:bg-stone-900/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="shrink-0 text-sm tabular-nums text-stone-400 dark:text-stone-500">
                              {formatDate(new Date(post.date), 'MM-dd')}
                            </span>
                            <span className="text-base font-medium text-stone-700 transition-colors group-hover:text-accent dark:text-stone-200 dark:group-hover:text-accent-dark md:text-lg">
                              {post.title}
                            </span>
                          </div>
                          <Tag type={post.type} />
                        </Link>
                      </article>
                    </StaggerItem>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tag({ type }: { type: string }) {
  const isTech = type === 'tech';
  return (
    <span
      className={`shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isTech
          ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      }`}
    >
      {type}
    </span>
  );
}

async function getData() {
  const usedParams: FileKeys[] = ['title', 'slug', 'date', 'type', 'fileType'];
  const files = markdownReader.getAll('_techs', usedParams);
  const blogs = markdownReader.getAll('_blogs', usedParams);
  return [...files, ...blogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function groupByYear(
  posts: Array<{
    title: string;
    slug: string;
    date: string;
    type: string;
    fileType: string;
  }>
) {
  const grouped: Record<string, typeof posts> = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });
  return grouped;
}
