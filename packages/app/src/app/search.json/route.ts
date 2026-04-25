import { markdownReader } from '@/utils';
import { FileKeys } from '@/core';

export async function GET() {
  const usedParams: FileKeys[] = [
    'title',
    'slug',
    'date',
    'excerpt',
    'tag',
    'type',
    'fileType',
  ];

  const techs = markdownReader.getAll('_techs', usedParams);
  const blogs = markdownReader.getAll('_blogs', usedParams);

  const posts = [...techs, ...blogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return Response.json(posts);
}
