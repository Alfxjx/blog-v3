import { BuyMeCoffee } from '@/components/buttons/buy-me-a-coffee';
import { markdownToHtml, formatDate } from '@/core';
import { markdownReader } from '@/utils';

export default async function Page() {
  const { contentInHTML, ...data } = await getData();
  return (
    <div className="w-full max-w-prose mx-auto mt-8">
      <article
        className="prose prose-slate dark:prose-invert prose-h2:my-2 px-2"
        dangerouslySetInnerHTML={{ __html: contentInHTML }}
      ></article>
      <section className="my-4 flex justify-center">
        <BuyMeCoffee />
      </section>
      <div className="flex justify-between py-4 mb-8">
        <div className="flex items-center justify-start">
          <img
            src={data.author.picture}
            className="w-6 rounded-full shadow mr-2"
            alt="avatar"
          />
          <section>{data.author.name}</section>
        </div>
        <time>{formatDate(new Date(data.date), 'yyyy-MM-dd')}</time>
      </div>
    </div>
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
