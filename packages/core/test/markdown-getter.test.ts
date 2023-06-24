import { describe, expect, it } from 'vitest';
import { MarkdownReader } from '../src/index';

describe('getFileBySlug', () => {
  it('should getFileBySlug', () => {
    const mr = new MarkdownReader('test');
    expect(mr.getFileBySlug('_about', 'index.md', ['title'])).toEqual({
      title: 'About me',
    });
  });
});

describe('getAll', () => {
  it('should getAll', () => {
    const mr = new MarkdownReader('test');
    expect(mr.getAll('_about', ['title'])).toEqual([
      {
        title: 'About me',
      },
    ]);
  });
});
