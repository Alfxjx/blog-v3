import fs from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

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

  getFileBySlug(
    fileType: FileTypes,
    slug: string,
    fields: FileKeys[] = [],
    mode: 'dir' | 'file' = 'dir'
  ) {
    let realSlug = '';
    if (mode === 'dir') {
      realSlug = slug.replace(/\.md$/, '');
    }
    const fullPath =
      mode === 'dir'
        ? join(this.getDirectory(fileType), slug)
        : join(this.getDirectory(fileType), slug) + '.md';

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const items: ResponseItem = {} as ResponseItem;
    items['fileType'] = fileType;
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

type FileKeys = FileKeyStr | 'author';

type FileKeyStr =
  | 'title'
  | 'date'
  | 'type'
  | 'tag'
  | 'slug'
  | 'content'
  | 'coverImage'
  | 'excerpt'
  | 'fileType';

type ResponseItem = Record<FileKeyStr, string> & {
  author: {
    name: string;
    picture: string;
  };
};

type FileTypes = '_techs' | '_blogs' | '_about' | '_short';

export type { FileKeys, ResponseItem, FileTypes };
