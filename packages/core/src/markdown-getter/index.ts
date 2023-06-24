import fs from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

import { FileKeys, ResponseItem, FileTypes } from './type.d';

export class MarkdownReader {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  getDirectory(fileType: FileTypes) {
    return join(process.cwd(), `${this.path}/${fileType}`);
  }

  getSlugsByFileType(fileType: FileTypes) {
    const directory = this.getDirectory(fileType);
    return fs.readdirSync(directory);
  }

  getFileBySlug(fileType: FileTypes, slug: string, fields: FileKeys[] = []) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = join(this.getDirectory(fileType), slug);
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

  getAll(fileType: FileTypes, fields: FileKeys[] = []) {
    const slugs = this.getSlugsByFileType(fileType);
    const posts = slugs
      .map(slug => this.getFileBySlug(fileType, slug, fields))
      // sort posts by date in descending order
      .sort(this.postSort);
    return posts;
  }

  private postSort(post1: ResponseItem, post2: ResponseItem) {
    if (!post1.date || !post2.date) {
      return 1;
    }
    return post1.date > post2.date ? -1 : 1;
  }
}
