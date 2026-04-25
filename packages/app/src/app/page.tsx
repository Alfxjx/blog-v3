import Link from 'next/link';
import { markdownReader } from '@/utils';
import { FileKeys, formatDate } from '@/core';
import { FadeIn, StaggerItem } from '@/components/animated-container';

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center py-24 text-center md:py-32">
        <FadeIn>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-800 dark:text-stone-100 md:text-6xl lg:text-7xl">
            Alfr3d&apos;s Blog
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="font-hand mt-4 text-2xl text-accent dark:text-accent-dark md:text-3xl">
            My own digital garden.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone-500 dark:text-stone-400">
            Standing at the crossroads of technology and humanity.
            Writing about code, life, and everything in between.
          </p>
        </FadeIn>
        <FadeIn delay={0.45}>
          <div className="mt-8">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-6 py-2.5 text-sm font-medium text-stone-700 transition-all hover:border-accent hover:bg-accent hover:text-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-accent-dark dark:hover:bg-accent-dark dark:hover:text-stone-950"
            >
              Explore Writings
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Latest Posts */}
      <section className="w-full max-w-2xl pb-24">
        <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Latest Writings
        </h2>
        <div className="flex flex-col gap-1">
          {latestPosts.map((post, i) => (
            <StaggerItem key={post.slug} delay={0.5 + i * 0.08}>
              <Link
                href={`/blogs/${post.slug}?fileType=${post.fileType}`}
                className="group flex items-baseline justify-between gap-4 py-3 transition-colors"
              >
                <span className="text-base font-medium text-stone-700 transition-colors group-hover:text-accent dark:text-stone-200 dark:group-hover:text-accent-dark">
                  {post.title}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-stone-400 dark:text-stone-500">
                  {formatDate(new Date(post.date), 'yyyy-MM-dd')}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/blogs"
            className="text-sm font-medium text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-accent-dark dark:hover:decoration-accent-dark"
          >
            View all posts →
          </Link>
        </div>
      </section>
    </div>
  );
}

async function getLatestPosts() {
  const usedParams: FileKeys[] = [
    'title',
    'slug',
    'date',
    'type',
    'fileType',
  ];
  const files = markdownReader.getAll('_techs', usedParams);
  const blogs = markdownReader.getAll('_blogs', usedParams);
  return [...files, ...blogs]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5);
}
