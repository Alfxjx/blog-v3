import { markdownReader } from '@/utils';
import { FileKeys } from '@blog-v3/core';
import Link from 'next/link';

export default async function Blogs() {
  const files = await getData();
  return (
    <div className="w-full">
      {files.map(x => (
        <div key={x.slug}>
          <Link href={`/blogs/${x.slug}?fileType=${x.fileType}`}>
            {x.title}
          </Link>
        </div>
      ))}
    </div>
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
