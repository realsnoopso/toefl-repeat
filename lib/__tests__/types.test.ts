import { describe, it, expect } from 'vitest';
import { BLOB_BASE } from '../types';

describe('constants', () => {
  it('BLOB_BASE is a valid URL', () => {
    expect(BLOB_BASE).toMatch(/^https:\/\//);
    expect(BLOB_BASE).toContain('vercel-storage.com');
  });

  it('BLOB_BASE does not end with slash', () => {
    expect(BLOB_BASE.endsWith('/')).toBe(false);
  });
});
