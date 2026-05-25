import { Tag } from '@/components/tag';
import { Attachments } from '@/components/attachments';
import { TableOfContents, MobileTableOfContents } from '@/components/toc';
import { ShareCard } from '@/components/share-card';
import { markdownToHtml, formatDate } from '@/core';
import { markdownReader } from '@/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Slugger from 'github-slugger';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const file = getFile(decodeURIComponent(slug));

  if (!file?.title) {
    return { title: 'Not Found' };
  }

  return {
    title: file.title,
    description:
      (typeof file.excerpt === 'string' ? file.excerpt : undefined) ||
      file.title,
    openGraph: {
      title: file.title,
      description:
        (typeof file.excerpt === 'string' ? file.excerpt : undefined) ||
        file.title,
      type: 'article',
      publishedTime: file.date,
      images: file.coverImage ? [{ url: file.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: file.title,
      description:
        (typeof file.excerpt === 'string' ? file.excerpt : undefined) ||
        file.title,
      images: file.coverImage ? [file.coverImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const techs = markdownReader
    .getSlugsByFileType('_techs')
    .map((slug) => ({ slug: slug.replace(/\.md$/, '') }));
  const blogs = markdownReader
    .getSlugsByFileType('_blogs')
    .map((slug) => ({ slug: slug.replace(/\.md$/, '') }));
  return [...techs, ...blogs];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { contentInHTML, headings, ...data } = await getData(decodeURIComponent(slug));

  if (!data.title) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-8">
      <article className="mx-auto w-full max-w-3xl pb-24 xl:mx-0">
        {/* Back link */}
        <Link
          href="/blogs"
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-accent dark:text-stone-400 dark:hover:text-accent-dark"
        >
          <FaArrowLeft size={12} />
          All writings
        </Link>

        {/* Header */}
        <header className="mb-10">
          {data.coverImage && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={data.coverImage}
                alt={data.title}
                className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          )}
          <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-stone-800 dark:text-stone-100 md:text-4xl lg:text-5xl">
            {data.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
            {data.author && (
              <div className="flex items-center gap-2">
                {data.author.picture && (
                  <img
                    src={data.author.picture}
                    className="h-7 w-7 rounded-full ring-2 ring-stone-100 dark:ring-stone-800"
                    alt={data.author.name}
                  />
                )}
                <span className="font-medium">{data.author.name}</span>
              </div>
            )}
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <time dateTime={data.date}>
              {formatDate(new Date(data.date), 'yyyy-MM-dd')}
            </time>
            {data.tag && (
              <>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <Tag className="text-xs">{data.tag}</Tag>
              </>
            )}
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <ShareCard
              title={data.title}
              excerpt={
                typeof data.excerpt === 'string' ? data.excerpt : undefined
              }
              date={data.date}
              author={data.author}
              tag={data.tag}
              slug={decodeURIComponent(slug)}
              coverImage={
                typeof data.coverImage === 'string'
                  ? data.coverImage
                  : undefined
              }
            />
          </div>
        </header>

        {/* Mobile TOC */}
        <MobileTableOfContents headings={headings} />

        {/* Content */}
        <div
          className="prose-custom prose-lg"
          dangerouslySetInnerHTML={{ __html: contentInHTML }}
        />

        {/* Footer */}
        <footer className="mt-16 border-t border-stone-100 pt-8 dark:border-stone-800">
          {data.attachments && data.attachments.length > 0 && (
            <div className="mb-8">
              <Attachments attachments={data.attachments} />
            </div>
          )}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-accent dark:text-stone-400 dark:hover:text-accent-dark"
          >
            <FaArrowLeft size={12} />
            Back to all writings
          </Link>
        </footer>
      </article>

      {/* TOC Sidebar */}
      {headings.length > 0 && (
        <aside
          className="hidden xl:block fixed top-28 w-60"
          style={{ right: 'max(2rem, calc(50vw - 40rem))' }}
        >
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  );
}

function getFile(slug: string) {
  let file: Record<string, any> | null = null;
  try {
    file = markdownReader.getFileBySlug(
      '_techs',
      slug,
      ['content', 'title', 'excerpt', 'coverImage', 'date', 'tag', 'author', 'attachments'],
      'file'
    );
  } catch {
    // not found in _techs
  }
  if (!file?.title) {
    try {
      file = markdownReader.getFileBySlug(
        '_blogs',
        slug,
        ['content', 'title', 'excerpt', 'coverImage', 'date', 'tag', 'author', 'attachments'],
        'file'
      );
    } catch {
      // not found in _blogs
    }
  }
  return file;
}

function extractHeadings(content: string) {
  const slugger = new Slugger();
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      const id = slugger.slug(text);
      headings.push({ level: 2, text, id });
    }
  }
  return headings;
}

async function getData(slug: string) {
  const file = getFile(slug);
  const contentInHTML = file?.content ? await markdownToHtml(file.content) : '';
  const headings = file?.content ? extractHeadings(file.content) : [];
  return { contentInHTML, headings, ...(file || {}) } as any;
}
