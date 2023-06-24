import fs from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

import { FileKeys, ResponseItem, FileTypes } from './type.d';

export function getDirectory(fileType: FileTypes) {
  return join(process.cwd(), `public/${fileType}`);
}

export function getSlugsByFileType(fileType: FileTypes) {
  const directory = getDirectory(fileType);
  return fs.readdirSync(directory);
}

export function getFileBySlug(
  fileType: FileTypes,
  slug: string,
  fields: FileKeys[] = []
) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(getDirectory(fileType), slug);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: ResponseItem = {};
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });
  return items;
}

export function getAll(fileType: FileTypes, fields: FileKeys[] = []) {
  const slugs = getSlugsByFileType(fileType);
  const posts = slugs
    .map(slug => getFileBySlug(fileType, slug, fields))
    // sort posts by date in descending order
    .sort(postSort);
  return posts;
}

/**
 * @description 比较两个返回的日期
 * @param {ResponseItem} post1
 * @param {ResponseItem} post2
 * @return {*}
 */
function postSort(post1: ResponseItem, post2: ResponseItem) {
  if (!post1.date || !post2.date) {
    return 1;
  }
  return post1.date > post2.date ? -1 : 1;
}
