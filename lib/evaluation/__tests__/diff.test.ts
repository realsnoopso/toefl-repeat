import { describe, it, expect } from 'vitest';
import { diffSentences, renderDiffText, calculateAccuracy } from '../diff';

describe('diffSentences', () => {
  it('returns all correct for identical sentences', () => {
    const tokens = diffSentences('Hello world', 'Hello world');
    expect(tokens).toEqual([
      { type: 'correct', original: 'Hello', spoken: 'Hello' },
      { type: 'correct', original: 'world', spoken: 'world' },
    ]);
  });

  it('is case-insensitive', () => {
    const tokens = diffSentences('Hello World', 'hello world');
    expect(tokens.every(t => t.type === 'correct')).toBe(true);
  });

  it('detects missing words', () => {
    const tokens = diffSentences('The cat sat on the mat', 'The cat on the mat');
    const missing = tokens.filter(t => t.type === 'missing');
    expect(missing.length).toBe(1);
    expect(missing[0].original).toBe('sat');
  });

  it('detects extra words', () => {
    const tokens = diffSentences('The cat', 'The big cat');
    const extra = tokens.filter(t => t.type === 'extra');
    expect(extra.length).toBe(1);
    expect(extra[0].spoken).toBe('big');
  });

  it('detects wrong (substituted) words', () => {
    const tokens = diffSentences('The cat sat', 'The dog sat');
    const wrong = tokens.filter(t => t.type === 'wrong');
    expect(wrong.length).toBe(1);
    expect(wrong[0].original).toBe('cat');
    expect(wrong[0].spoken).toBe('dog');
  });

  it('handles empty original', () => {
    const tokens = diffSentences('', 'hello world');
    expect(tokens.every(t => t.type === 'extra')).toBe(true);
    expect(tokens.length).toBe(2);
  });

  it('handles empty spoken', () => {
    const tokens = diffSentences('hello world', '');
    expect(tokens.every(t => t.type === 'missing')).toBe(true);
    expect(tokens.length).toBe(2);
  });

  it('handles both empty', () => {
    const tokens = diffSentences('', '');
    expect(tokens).toEqual([]);
  });

  it('strips punctuation before comparing', () => {
    const tokens = diffSentences('Hello, world!', 'Hello world');
    expect(tokens.every(t => t.type === 'correct')).toBe(true);
  });

  it('handles completely different sentences', () => {
    const tokens = diffSentences('The cat sat', 'Dogs run fast');
    // All should be wrong/missing/extra, no correct
    const correct = tokens.filter(t => t.type === 'correct');
    expect(correct.length).toBe(0);
  });

  it('handles repeated words correctly', () => {
    const tokens = diffSentences('Stop Stop Stop', 'Stop Stop');
    const correct = tokens.filter(t => t.type === 'correct');
    const missing = tokens.filter(t => t.type === 'missing');
    expect(correct.length).toBe(2);
    expect(missing.length).toBe(1);
  });

  it('handles long sentences', () => {
    const original = 'Staff schedule and memos are posted on the bulletin board';
    const spoken = 'Start schedule and memos are posted on the Baltimore board';
    const tokens = diffSentences(original, spoken);
    const correct = tokens.filter(t => t.type === 'correct');
    // "schedule", "and", "memos", "are", "posted", "on", "the", "board" = 8 correct
    expect(correct.length).toBeGreaterThanOrEqual(7);
  });
});

describe('renderDiffText', () => {
  it('renders correct words as-is', () => {
    const result = renderDiffText([{ type: 'correct', original: 'hello', spoken: 'hello' }]);
    expect(result).toBe('hello');
  });

  it('renders wrong words with strikethrough', () => {
    const result = renderDiffText([{ type: 'wrong', original: 'cat', spoken: 'dog' }]);
    expect(result).toBe('~~dog~~cat');
  });

  it('renders missing words in parens', () => {
    const result = renderDiffText([{ type: 'missing', original: 'sat' }]);
    expect(result).toBe('(sat)');
  });

  it('renders extra words in brackets', () => {
    const result = renderDiffText([{ type: 'extra', spoken: 'very' }]);
    expect(result).toBe('[very]');
  });

  it('renders mixed tokens', () => {
    const result = renderDiffText([
      { type: 'correct', original: 'The', spoken: 'The' },
      { type: 'wrong', original: 'cat', spoken: 'dog' },
      { type: 'missing', original: 'sat' },
    ]);
    expect(result).toBe('The ~~dog~~cat (sat)');
  });
});

describe('calculateAccuracy', () => {
  it('returns 5 for perfect match', () => {
    const tokens = diffSentences('hello world', 'hello world');
    expect(calculateAccuracy(tokens)).toBe(5);
  });

  it('returns 0 for empty tokens', () => {
    expect(calculateAccuracy([])).toBe(0);
  });

  it('returns 0 for completely wrong', () => {
    const tokens = diffSentences('hello world', '');
    expect(calculateAccuracy(tokens)).toBe(0);
  });

  it('returns partial score for partial match', () => {
    const tokens = diffSentences('The cat sat on the mat', 'The cat on the mat');
    const score = calculateAccuracy(tokens);
    expect(score).toBeGreaterThan(3);
    expect(score).toBeLessThan(5);
  });

  it('does not penalize extra words as hard', () => {
    const tokensExtra = diffSentences('The cat', 'The very big cat');
    const tokensMissing = diffSentences('The very big cat', 'The cat');
    // Extra words should result in higher accuracy than missing words
    expect(calculateAccuracy(tokensExtra)).toBeGreaterThanOrEqual(calculateAccuracy(tokensMissing));
  });
});
