import { markdownReader } from '@/utils';
import { FileKeys, markdownToHtml } from '@/core';

export async function GET() {
  const usedParams: FileKeys[] = ['title', 'slug', 'date', 'excerpt', 'tag', 'fileType', 'content'];

  const techs = markdownReader.getAll('_techs', usedParams);
  const blogs = markdownReader.getAll('_blogs', usedParams);

  const posts = [...techs, ...blogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const items = await Promise.all(
    posts.map(async (post) => {
      const link = `https://alfxjx.github.io/blogs/${post.slug}?fileType=${post.fileType}`;
      const contentHtml = await markdownToHtml(post.content || '');
      const excerpt = typeof post.excerpt === 'string' ? post.excerpt : '';
      const tag = Array.isArray(post.tag) ? post.tag.join(', ') : post.tag || '';

      return `
    <item>
      <title><![CDATA[${post.title || 'Untitled'}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${tag ? `<category><![CDATA[${tag}]]></category>` : ''}
      <description><![CDATA[${excerpt || post.title}]]></description>
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
    </item>`;
    })
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alfr3d's Blog</title>
    <link>https://alfxjx.github.io</link>
    <description>Standing at the crossroads of technology and humanity. Writing about code, life, and everything in between.</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://alfxjx.github.io/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
