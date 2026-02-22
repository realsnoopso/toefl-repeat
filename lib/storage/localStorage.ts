import { PracticeAttempt } from '../types';

const STORAGE_KEY = 'toefl-repeat-attempts';

export function getAttempts(): PracticeAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: PracticeAttempt): void {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  // Keep max 500
  if (attempts.length > 500) attempts.length = 500;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function getAttemptsForExercise(exerciseId: string): PracticeAttempt[] {
  return getAttempts().filter(a => a.exerciseId === exerciseId);
}

export function getBestScore(exerciseId: string): number | null {
  const attempts = getAttemptsForExercise(exerciseId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map(a => a.scores.total));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
