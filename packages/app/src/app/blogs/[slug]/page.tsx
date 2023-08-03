import { Tag } from '@/components/tag';
import { markdownToHtml, FileTypes, formatDate } from '@/core';
import { markdownReader } from '@/utils';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { fileType: FileTypes };
}) {
  const { contentInHTML, ...data } = await getData(
    searchParams.fileType,
    decodeURIComponent(params.slug)
  );
  return (
    <div className="w-full max-w-prose mx-auto px-2">
      <h1 className="text-2xl font-bold my-4">{data.title}</h1>
      <div className="flex items-center justify-start mb-2">
        <img
          src={data.author.picture}
          className="w-6 rounded-full shadow"
          alt="avatar"
        />
        <section>{data.author.name}</section>
      </div>
      <article
        className="prose dark:prose-invert prose-h2:my-2"
        dangerouslySetInnerHTML={{ __html: contentInHTML }}
      ></article>
      <div className="flex justify-between py-4">
        <Tag className="text-black text-center bg-zinc-400">{data.tag}</Tag>
        <time>{formatDate(new Date(data.date), 'yyyy-MM-dd')}</time>
      </div>
    </div>
  );
}

async function getData(fileType: FileTypes, slug: string) {
  const file = await markdownReader.getFileBySlug(
    fileType,
    slug,
    ['content', 'coverImage', 'date', 'tag', 'title', 'author'],
    'file'
  );
  const contentInHTML = await markdownToHtml(file.content);
  return { contentInHTML, ...file };
}
