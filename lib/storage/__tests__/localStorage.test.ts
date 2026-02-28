import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAttempts, saveAttempt, getAttemptsForExercise, getBestScore, clearAllData } from '../localStorage';
import { PracticeAttempt } from '../../types';

function makeAttempt(overrides: Partial<PracticeAttempt> = {}): PracticeAttempt {
  return {
    id: `test-${Date.now()}-${Math.random()}`,
    exerciseId: 'T1_1',
    exerciseTitle: 'Task 1 - 1번',
    segmentIndex: 0,
    timestamp: Date.now(),
    recordingDuration: 5.0,
    userTranscript: 'hello world',
    scores: { fluency: 3, intelligibility: 3, accuracy: 3, total: 3 },
    feedback: 'Good',
    ...overrides,
  };
}

describe('localStorage storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAttempts', () => {
    it('returns empty array when nothing stored', () => {
      expect(getAttempts()).toEqual([]);
    });

    it('returns stored attempts', () => {
      const attempt = makeAttempt();
      saveAttempt(attempt);
      const result = getAttempts();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(attempt.id);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('toefl-repeat-attempts', 'not-json');
      expect(getAttempts()).toEqual([]);
    });
  });

  describe('saveAttempt', () => {
    it('prepends new attempt (most recent first)', () => {
      const a1 = makeAttempt({ id: 'first' });
      const a2 = makeAttempt({ id: 'second' });
      saveAttempt(a1);
      saveAttempt(a2);
      const result = getAttempts();
      expect(result[0].id).toBe('second');
      expect(result[1].id).toBe('first');
    });

    it('caps at 500 attempts', () => {
      for (let i = 0; i < 510; i++) {
        saveAttempt(makeAttempt({ id: `attempt-${i}` }));
      }
      expect(getAttempts().length).toBe(500);
    });
  });

  describe('getAttemptsForExercise', () => {
    it('filters by exerciseId', () => {
      saveAttempt(makeAttempt({ exerciseId: 'T1_1' }));
      saveAttempt(makeAttempt({ exerciseId: 'T1_2' }));
      saveAttempt(makeAttempt({ exerciseId: 'T1_1' }));
      expect(getAttemptsForExercise('T1_1').length).toBe(2);
      expect(getAttemptsForExercise('T1_2').length).toBe(1);
      expect(getAttemptsForExercise('T1_3').length).toBe(0);
    });
  });

  describe('getBestScore', () => {
    it('returns null when no attempts', () => {
      expect(getBestScore('T1_1')).toBeNull();
    });

    it('returns highest total score', () => {
      saveAttempt(makeAttempt({ exerciseId: 'T1_1', scores: { fluency: 2, intelligibility: 2, accuracy: 2, total: 2 } }));
      saveAttempt(makeAttempt({ exerciseId: 'T1_1', scores: { fluency: 4, intelligibility: 4, accuracy: 4, total: 4.5 } }));
      saveAttempt(makeAttempt({ exerciseId: 'T1_1', scores: { fluency: 3, intelligibility: 3, accuracy: 3, total: 3 } }));
      expect(getBestScore('T1_1')).toBe(4.5);
    });
  });

  describe('clearAllData', () => {
    it('removes all attempts', () => {
      saveAttempt(makeAttempt());
      saveAttempt(makeAttempt());
      clearAllData();
      expect(getAttempts()).toEqual([]);
    });
  });
});
