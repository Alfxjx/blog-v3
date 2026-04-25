import type { MetadataRoute } from 'next';
import { markdownReader } from '@/utils';
import { FileKeys } from '@/core';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const usedParams: FileKeys[] = ['slug', 'date', 'fileType'];

  const techs = markdownReader.getAll('_techs', usedParams);
  const blogs = markdownReader.getAll('_blogs', usedParams);

  const posts = [...techs, ...blogs];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://alfxjx.github.io/blogs/${post.slug}?fileType=${post.fileType}`,
    lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const routes = ['', '/blogs', '/about', '/short', '/playground'].map((route) => ({
    url: `https://alfxjx.github.io${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.6,
  }));

  return [...routes, ...postEntries];
}
