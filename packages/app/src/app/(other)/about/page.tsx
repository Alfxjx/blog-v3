import { BuyMeCoffee } from '@/components/buttons/buy-me-a-coffee';
import { markdownToHtml, formatDate } from '@/core';
import { markdownReader } from '@/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Alfr3d, the person behind this blog.',
};

export default async function Page() {
  const { contentInHTML, ...data } = await getData();
  return (
    <article className="mx-auto max-w-3xl pb-24">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-800 dark:text-stone-100 md:text-4xl">
          About
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          {data.author?.picture && (
            <img
              src={data.author.picture}
              className="h-8 w-8 rounded-full ring-2 ring-stone-100 dark:ring-stone-800"
              alt={data.author.name}
            />
          )}
          <span className="font-medium">{data.author?.name}</span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <time dateTime={data.date}>
            {formatDate(new Date(data.date), 'yyyy-MM-dd')}
          </time>
        </div>
      </header>

      <div
        className="prose-custom prose-lg"
        dangerouslySetInnerHTML={{ __html: contentInHTML }}
      />

      <section className="mt-12 flex justify-center">
        <BuyMeCoffee />
      </section>
    </article>
  );
}

async function getData() {
  const file = await markdownReader.getFileBySlug(
    '_about',
    'index',
    ['content', 'date', 'author'],
    'file'
  );
  const contentInHTML = await markdownToHtml(file.content);
  return { contentInHTML, ...file };
}
