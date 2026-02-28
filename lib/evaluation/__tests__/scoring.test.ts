import { describe, it, expect } from 'vitest';
import { evaluateAttempt } from '../scoring';

describe('evaluateAttempt', () => {
  const base = {
    exerciseId: 'T1_1',
    exerciseTitle: 'Task 1 - 1번',
    segmentIndex: 0,
  };

  describe('with original text', () => {
    const original = 'Staff schedule and memos are posted on the bulletin board';

    it('gives high score for perfect match', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, original, base.segmentIndex, original
      );
      expect(result.scores.total).toBeGreaterThanOrEqual(4.5);
      expect(result.scores.accuracy).toBe(5);
      expect(result.feedback).toContain('완벽');
    });

    it('gives low score for completely wrong transcript', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, 'something completely different here now', base.segmentIndex, original
      );
      expect(result.scores.total).toBeLessThan(2);
    });

    it('gives medium score for partial match', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        4.0, 'Staff schedule are posted on the board', base.segmentIndex, original
      );
      expect(result.scores.total).toBeGreaterThan(2);
      expect(result.scores.total).toBeLessThan(5);
    });

    it('gives zero for empty transcript with short recording', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        0.5, '', base.segmentIndex, original
      );
      expect(result.scores.total).toBe(0);
      expect(result.feedback).toContain('짧습니다');
    });

    it('gives low score for empty transcript with long recording (STT failure)', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, '', base.segmentIndex, original
      );
      expect(result.scores.total).toBeGreaterThan(0);
      expect(result.scores.total).toBeLessThan(2);
      expect(result.feedback).toContain('인식되지');
    });
  });

  describe('without original text', () => {
    it('gives moderate score when no original available', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, 'hello world test sentence', base.segmentIndex, undefined
      );
      expect(result.scores.total).toBeGreaterThan(1);
      expect(result.scores.total).toBeLessThanOrEqual(3);
    });
  });

  describe('result structure', () => {
    it('returns valid PracticeAttempt shape', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        3.0, 'test', base.segmentIndex, 'test'
      );
      expect(result.id).toBeTruthy();
      expect(result.exerciseId).toBe(base.exerciseId);
      expect(result.exerciseTitle).toBe(base.exerciseTitle);
      expect(result.segmentIndex).toBe(0);
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.recordingDuration).toBe(3.0);
      expect(result.userTranscript).toBe('test');
      expect(result.scores).toHaveProperty('fluency');
      expect(result.scores).toHaveProperty('intelligibility');
      expect(result.scores).toHaveProperty('accuracy');
      expect(result.scores).toHaveProperty('total');
      expect(result.feedback).toBeTruthy();
    });

    it('generates unique ids', () => {
      const r1 = evaluateAttempt('T1_1', 'T', 3, 'test', 0, 'test');
      const r2 = evaluateAttempt('T1_1', 'T', 3, 'test', 0, 'test');
      expect(r1.id).not.toBe(r2.id);
    });

    it('clamps scores to 0-5 range', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        100.0, 'a', base.segmentIndex, 'a very long original sentence with many words'
      );
      expect(result.scores.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.scores.accuracy).toBeLessThanOrEqual(5);
      expect(result.scores.fluency).toBeGreaterThanOrEqual(0);
      expect(result.scores.fluency).toBeLessThanOrEqual(5);
      expect(result.scores.intelligibility).toBeGreaterThanOrEqual(0);
      expect(result.scores.intelligibility).toBeLessThanOrEqual(5);
      expect(result.scores.total).toBeGreaterThanOrEqual(0);
      expect(result.scores.total).toBeLessThanOrEqual(5);
    });
  });

  describe('scoring weights', () => {
    it('total = accuracy*0.5 + completeness*0.3 + fluency*0.2', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        4.0, 'Staff schedule and memos are posted on the bulletin board',
        base.segmentIndex, 'Staff schedule and memos are posted on the bulletin board'
      );
      const expected = Math.round(
        (result.scores.accuracy * 0.5 + result.scores.intelligibility * 0.3 + result.scores.fluency * 0.2) * 10
      ) / 10;
      expect(result.scores.total).toBe(expected);
    });
  });

  describe('feedback messages', () => {
    it('gives encouragement for high accuracy', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, 'The cat sat on the mat', base.segmentIndex, 'The cat sat on the mat'
      );
      expect(result.feedback).toMatch(/완벽|잘했/);
    });

    it('gives improvement feedback for low accuracy', () => {
      const result = evaluateAttempt(
        base.exerciseId, base.exerciseTitle,
        5.0, 'random words here', base.segmentIndex, 'The cat sat on the mat is very soft'
      );
      expect(result.feedback).toMatch(/연습|집중|들어/);
    });
  });
});
