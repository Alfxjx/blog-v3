import { describe, expect, it } from 'vitest';
import { getFileBySlug, getAll } from '../src/index';

describe('getFileBySlug', () => {
  it('should getFileBySlug', () => {
    expect(getFileBySlug('_about', 'index.md', ['title'])).toEqual({
      title: 'About me',
    });
  });
});

describe('getAll', () => {
  it('should getAll', () => {
    expect(getAll('_about', ['title'])).toEqual([
      {
        title: 'About me',
      },
    ]);
  });
});
