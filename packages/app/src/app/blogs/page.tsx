import { markdownReader } from '@/utils';
import { FileKeys, formatDate } from '@/core';
import Link from 'next/link';
import { Tag } from '@/components/tag';

export default async function Blogs() {
  const files = await getData();
  return (
    <div className="p-7">
      <div className="w-full sm:w-4/6 mx-auto">
        {files.map(x => (
          <div key={x.slug} className="flex justify-start items-start my-2">
            <span className="block text-gray-400 flex-0 w-12 whitespace-nowrap">
              {formatDate(new Date(x.date), 'MM-dd')}
            </span>
            <Tag
              className={`text-black flex-0 w-12 text-center ${
                x.type === 'tech' ? 'bg-zinc-400' : 'bg-zinc-300'
              }`}
            >
              {x.type}
            </Tag>
            <section className="flex-1">
              <Link href={`/blogs/${x.slug}?fileType=${x.fileType}`}>
                {x.title}
              </Link>
            </section>
          </div>
        ))}
      </div>
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
