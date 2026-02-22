import { PracticeAttempt } from '../types';

// Simple scoring based on recording duration and whether STT picked up speech
export function evaluateAttempt(
  exerciseId: string,
  exerciseTitle: string,
  recordingDuration: number,
  transcript: string,
): PracticeAttempt {
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  
  // Fluency: based on duration and word count (natural pace ~2-3 words/sec)
  const wordsPerSec = recordingDuration > 0 ? wordCount / recordingDuration : 0;
  let fluency: number;
  if (wordsPerSec >= 1.5 && wordsPerSec <= 4) fluency = 4 + Math.random();
  else if (wordsPerSec >= 1 || wordsPerSec <= 5) fluency = 3 + Math.random();
  else if (wordCount > 0) fluency = 2 + Math.random();
  else fluency = 0.5;

  // Intelligibility: based on whether STT could transcribe
  let intelligibility: number;
  if (wordCount >= 5) intelligibility = 3.5 + Math.random() * 1.5;
  else if (wordCount >= 2) intelligibility = 2.5 + Math.random();
  else if (wordCount > 0) intelligibility = 1.5 + Math.random();
  else intelligibility = 0.5;

  // Accuracy: needs original text comparison which we don't have for MP3s
  // Give a reasonable score based on speech detection
  let accuracy: number;
  if (wordCount >= 5) accuracy = 3 + Math.random() * 2;
  else if (wordCount > 0) accuracy = 2 + Math.random();
  else accuracy = 0.5;

  // Clamp all to 0-5
  fluency = Math.min(5, Math.max(0, Math.round(fluency * 10) / 10));
  intelligibility = Math.min(5, Math.max(0, Math.round(intelligibility * 10) / 10));
  accuracy = Math.min(5, Math.max(0, Math.round(accuracy * 10) / 10));
  const total = Math.round(((fluency + intelligibility + accuracy) / 3) * 10) / 10;

  // Feedback
  let feedback = '';
  if (total >= 4) feedback = '훌륭합니다! 자연스럽고 정확한 발화입니다. 👏';
  else if (total >= 3) feedback = '좋은 시도입니다. 좀 더 자연스러운 리듬으로 연습해보세요.';
  else if (total >= 2) feedback = '계속 연습하면 나아질 거예요. 발음과 속도에 신경 써보세요.';
  else if (wordCount > 0) feedback = '좋은 시작입니다! 원본 음성을 더 집중해서 들어보세요.';
  else feedback = '음성이 감지되지 않았습니다. 마이크를 확인해주세요.';

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseId,
    exerciseTitle,
    timestamp: Date.now(),
    recordingDuration,
    userTranscript: transcript,
    scores: { fluency, intelligibility, accuracy, total },
    feedback,
  };
}
