import { markdownReader } from '@/utils';
import { FileTypes } from '@blog-v3/core';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { fileType: FileTypes };
}) {
  const data = await getData(
    searchParams.fileType,
    decodeURIComponent(params.slug)
  );
  return (
    <div className="w-full">
      <h2>{data.title}</h2>
      <span>{data.tag}</span>
      <time>{data.date}</time>
      <section>{data.author.name}</section>
      <article>{data.content}</article>
    </div>
  );
}

async function getData(fileType: FileTypes, slug: string) {
  const file = markdownReader.getFileBySlug(
    fileType,
    slug,
    ['content', 'coverImage', 'date', 'tag', 'title', 'author'],
    'file'
  );
  return file;
}
