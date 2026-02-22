import { PracticeAttempt } from '../types';
import { diffSentences } from './diff';

/**
 * TOEFL Speaking Task 1 (Listen & Repeat) scoring
 * Based on comparison with original sentence.
 * 
 * Scoring criteria (0-5 scale):
 * - Accuracy: word-level match with original (via diff)
 * - Fluency: natural pace, no excessive pauses
 * - Completeness: how much of the original was attempted
 */
export function evaluateAttempt(
  exerciseId: string,
  exerciseTitle: string,
  recordingDuration: number,
  transcript: string,
  segmentIndex: number = 0,
  originalText?: string,
): PracticeAttempt {
  const spokenWords = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = spokenWords.length;
  const hasTranscript = wordCount > 0;
  const hasOriginal = !!originalText?.trim();
  const likelySpoke = recordingDuration >= 1.0;

  let accuracy = 0;
  let fluency = 0;
  let completeness = 0;
  let diffAccuracyPct = 0;

  if (hasTranscript && hasOriginal) {
    // === Real scoring with original text comparison ===
    const tokens = diffSentences(originalText!, transcript);
    const correctCount = tokens.filter(t => t.type === 'correct').length;
    const wrongCount = tokens.filter(t => t.type === 'wrong').length;
    const missingCount = tokens.filter(t => t.type === 'missing').length;
    const extraCount = tokens.filter(t => t.type === 'extra').length;
    const originalWordCount = tokens.filter(t => t.type !== 'extra').length;

    // Accuracy: correct / (correct + wrong + missing)
    // Penalize wrong words more than missing ones
    diffAccuracyPct = originalWordCount > 0
      ? Math.round((correctCount / originalWordCount) * 100)
      : 0;

    // Accuracy score (0-5): strict mapping
    if (diffAccuracyPct >= 95) accuracy = 5;
    else if (diffAccuracyPct >= 85) accuracy = 4 + (diffAccuracyPct - 85) / 10;
    else if (diffAccuracyPct >= 70) accuracy = 3 + (diffAccuracyPct - 70) / 15;
    else if (diffAccuracyPct >= 50) accuracy = 2 + (diffAccuracyPct - 50) / 20;
    else if (diffAccuracyPct >= 30) accuracy = 1 + (diffAccuracyPct - 30) / 20;
    else accuracy = diffAccuracyPct / 30;

    // Completeness: penalize missing words and extra words
    const attemptedRatio = originalWordCount > 0
      ? (correctCount + wrongCount) / originalWordCount
      : 0;
    if (attemptedRatio >= 0.95) completeness = 5;
    else if (attemptedRatio >= 0.8) completeness = 4 + (attemptedRatio - 0.8) / 0.15;
    else if (attemptedRatio >= 0.6) completeness = 3 + (attemptedRatio - 0.6) / 0.2;
    else if (attemptedRatio >= 0.3) completeness = 2 + (attemptedRatio - 0.3) / 0.3;
    else completeness = attemptedRatio / 0.3 * 2;

    // Extra words penalty (minor)
    if (extraCount > 2) completeness = Math.max(0, completeness - 0.5);

    // Fluency: pace-based (natural English ~2-3 words/sec for repeat tasks)
    const wordsPerSec = recordingDuration > 0 ? wordCount / recordingDuration : 0;
    if (wordsPerSec >= 1.5 && wordsPerSec <= 3.5) fluency = 4 + Math.min(1, (wordsPerSec - 1.5) / 2);
    else if (wordsPerSec >= 1.0 && wordsPerSec <= 4.5) fluency = 3 + Math.random() * 0.5;
    else if (wordsPerSec >= 0.5) fluency = 2 + Math.random() * 0.5;
    else fluency = 1;

    // If accuracy is very low, fluency doesn't matter much
    if (diffAccuracyPct < 30) fluency = Math.min(fluency, 2);

  } else if (hasTranscript) {
    // No original text — basic scoring
    const wordsPerSec = recordingDuration > 0 ? wordCount / recordingDuration : 0;
    fluency = wordsPerSec >= 1.5 && wordsPerSec <= 4 ? 3 : 2;
    accuracy = 2; // can't verify without original
    completeness = 2;
  } else if (likelySpoke) {
    // STT failed but user recorded
    fluency = 1.5;
    accuracy = 1.5;
    completeness = 1.5;
  } else {
    fluency = 0;
    accuracy = 0;
    completeness = 0;
  }

  // Clamp to 0-5
  accuracy = Math.min(5, Math.max(0, Math.round(accuracy * 10) / 10));
  fluency = Math.min(5, Math.max(0, Math.round(fluency * 10) / 10));
  completeness = Math.min(5, Math.max(0, Math.round(completeness * 10) / 10));

  // Total: weighted average (accuracy 50%, completeness 30%, fluency 20%)
  const total = Math.round((accuracy * 0.5 + completeness * 0.3 + fluency * 0.2) * 10) / 10;

  // Feedback based on accuracy percentage
  let feedback = '';
  if (!likelySpoke) {
    feedback = '녹음이 너무 짧습니다. 문장을 끝까지 말해보세요.';
  } else if (!hasTranscript) {
    feedback = '음성이 인식되지 않았습니다. 녹음 재생으로 확인하세요.';
  } else if (!hasOriginal) {
    feedback = '원문이 없어 정확한 채점이 어렵습니다. 녹음을 다시 들어보세요.';
  } else if (diffAccuracyPct >= 90) {
    feedback = '거의 완벽합니다! 원어민 수준의 정확도예요. 👏';
  } else if (diffAccuracyPct >= 75) {
    feedback = '잘했어요! 몇 단어만 더 정확하게 발음하면 만점입니다.';
  } else if (diffAccuracyPct >= 55) {
    feedback = '핵심은 잡았어요. 빠진 단어와 틀린 부분을 확인하고 다시 시도해보세요.';
  } else if (diffAccuracyPct >= 35) {
    feedback = '좀 더 연습이 필요해요. 원문을 천천히 듣고 한 구절씩 따라해보세요.';
  } else {
    feedback = '원문을 다시 한번 집중해서 들어보세요. 느린 속도로 시작해보세요.';
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseId,
    exerciseTitle,
    segmentIndex,
    timestamp: Date.now(),
    recordingDuration,
    userTranscript: transcript,
    scores: { fluency, intelligibility: completeness, accuracy, total },
    feedback,
  };
}
