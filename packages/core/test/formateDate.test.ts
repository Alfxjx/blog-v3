import { describe, expect, it } from 'vitest';
import { formatDate } from '../src/index';

describe('formatDate', () => {
  it('should formatDate', () => {
    expect(formatDate(new Date('2023-03-01'), 'yyyy/MM/dd')).toEqual(
      '2023/03/01'
    );
  });
});
