import { Sentence } from '../types';

// 단어 정규화 (소문자, 구두점 제거)
function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\w]/g, '');
}

// 텍스트를 단어 배열로 변환
function tokenize(text: string): string[] {
  return text.split(/\s+/).map(normalizeWord).filter(w => w.length > 0);
}

// Fluency 점수 계산 (0-5)
export function calculateFluency(params: {
  responseLatency: number; // ms
  pauseCount: number;
  recordingDuration: number; // ms
}): number {
  const { responseLatency, pauseCount, recordingDuration } = params;
  
  // Response Latency 점수 (0.5초 이내 = 5점)
  let latencyScore = 5;
  if (responseLatency > 3000) latencyScore = 0;
  else if (responseLatency > 2000) latencyScore = 2;
  else if (responseLatency > 1000) latencyScore = 3;
  else if (responseLatency > 500) latencyScore = 4;
  
  // Pause 점수
  let pauseScore = 5;
  if (pauseCount === 0) pauseScore = 5;
  else if (pauseCount === 1) pauseScore = 4;
  else if (pauseCount === 2) pauseScore = 3;
  else pauseScore = 1;
  
  // 최종 Fluency 점수
  const fluencyScore = (latencyScore * 0.6 + pauseScore * 0.4);
  
  return Math.max(0, Math.min(5, fluencyScore));
}

// Intelligibility 점수 계산 (0-5)
export function calculateIntelligibility(params: {
  sttConfidence: number; // 0-1
  transcript: string;
  originalWords: string[];
}): number {
  const { sttConfidence, transcript, originalWords } = params;
  
  // STT 신뢰도 기반
  const confidenceScore = sttConfidence * 5;
  
  // 인식된 단어 수 / 원본 단어 수
  const userWords = tokenize(transcript);
  const recognitionRate = userWords.length / Math.max(originalWords.length, 1);
  const recognitionScore = Math.min(recognitionRate, 1) * 5;
  
  // 최종 Intelligibility 점수
  const intelligibilityScore = (confidenceScore * 0.6 + recognitionScore * 0.4);
  
  return Math.max(0, Math.min(5, intelligibilityScore));
}

// Accuracy 점수 계산 (0-5)
export function calculateAccuracy(params: {
  userTranscript: string;
  originalSentence: Sentence;
}): number {
  const { userTranscript, originalSentence } = params;
  
  const userWords = tokenize(userTranscript);
  const originalWords = tokenize(originalSentence.text);
  const contentWords = originalSentence.contentWords.map(normalizeWord);
  
  // Content word 일치율
  let contentMatches = 0;
  contentWords.forEach(cw => {
    if (userWords.includes(cw)) {
      contentMatches++;
    }
  });
  
  const contentAccuracy = contentWords.length > 0 
    ? contentMatches / contentWords.length 
    : 1;
  
  // 전체 단어 순서 일치율 (간단한 Levenshtein 거리)
  const orderAccuracy = calculateWordOrderSimilarity(userWords, originalWords);
  
  // 최종 Accuracy 점수
  const accuracyScore = (contentAccuracy * 0.7 + orderAccuracy * 0.3) * 5;
  
  return Math.max(0, Math.min(5, accuracyScore));
}

// 단어 순서 유사도 계산 (간단한 버전)
function calculateWordOrderSimilarity(words1: string[], words2: string[]): number {
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  const maxLen = Math.max(words1.length, words2.length);
  
  for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
    if (words1[i] === words2[i]) {
      matches++;
    }
  }
  
  return matches / maxLen;
}

// 총점 계산
export function calculateTotalScore(scores: {
  fluency: number;
  intelligibility: number;
  accuracy: number;
}): number {
  const total = (scores.fluency + scores.intelligibility + scores.accuracy) / 3;
  // 0.5 단위로 반올림
  return Math.round(total * 2) / 2;
}

// 피드백 생성
export function generateFeedback(scores: {
  fluency: number;
  intelligibility: number;
  accuracy: number;
  total: number;
}): { overall: string; actionItems: string[] } {
  const { total, fluency, intelligibility, accuracy } = scores;
  
  let overall = '';
  const actionItems: string[] = [];
  
  // Overall feedback
  if (total >= 4.5) {
    overall = 'Excellent! Near-perfect repetition.';
    actionItems.push('Try harder sentences to challenge yourself.');
  } else if (total >= 3.5) {
    overall = 'Good job! Minor improvements needed.';
  } else if (total >= 2.5) {
    overall = 'Fair attempt. Several areas need work.';
  } else if (total >= 1.5) {
    overall = 'Needs improvement. Keep practicing.';
    actionItems.push('Start with slower or shorter sentences.');
  } else {
    overall = 'Difficult attempt. Don\'t give up!';
    actionItems.push('Listen multiple times before speaking.');
  }
  
  // Dimension-specific feedback
  if (fluency < 3.5) {
    actionItems.push('Try to start speaking immediately after the beep. Reduce pauses between words.');
  }
  if (intelligibility < 3.5) {
    actionItems.push('Focus on clear pronunciation. Slow down if needed for clarity.');
  }
  if (accuracy < 3.5) {
    actionItems.push('Listen more carefully to content words. Try to remember the exact sentence.');
  }
  
  return { overall, actionItems };
}

// 메트릭 계산
export function calculateMetrics(params: {
  userTranscript: string;
  originalSentence: Sentence;
  pauseCount?: number;
}): {
  pauseCount: number;
  contentWordMatches: number;
  contentWordTotal: number;
  wordOrderAccuracy: number;
} {
  const { userTranscript, originalSentence, pauseCount = 0 } = params;
  
  const userWords = tokenize(userTranscript);
  const originalWords = tokenize(originalSentence.text);
  const contentWords = originalSentence.contentWords.map(normalizeWord);
  
  let contentMatches = 0;
  contentWords.forEach(cw => {
    if (userWords.includes(cw)) {
      contentMatches++;
    }
  });
  
  const orderAccuracy = calculateWordOrderSimilarity(userWords, originalWords);
  
  return {
    pauseCount,
    contentWordMatches: contentMatches,
    contentWordTotal: contentWords.length,
    wordOrderAccuracy: orderAccuracy
  };
}
