import { PracticeAttempt } from '../types';

export function evaluateAttempt(
  exerciseId: string,
  exerciseTitle: string,
  recordingDuration: number,
  transcript: string,
  segmentIndex: number = 0,
): PracticeAttempt {
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const hasTranscript = wordCount > 0;
  
  // Even without STT, if recording duration is reasonable, the user spoke
  const likelySpoke = recordingDuration >= 1.0;

  // Fluency: based on duration (natural English speech ~120-160 wpm → ~2-2.7 words/sec)
  let fluency: number;
  if (hasTranscript) {
    const wordsPerSec = recordingDuration > 0 ? wordCount / recordingDuration : 0;
    if (wordsPerSec >= 1.5 && wordsPerSec <= 4) fluency = 4 + Math.random();
    else if (wordsPerSec >= 1 || wordsPerSec <= 5) fluency = 3 + Math.random();
    else fluency = 2 + Math.random();
  } else if (likelySpoke) {
    // No transcript but recording exists — give moderate score
    fluency = 2.5 + Math.random() * 1.5;
  } else {
    fluency = 0.5;
  }

  // Intelligibility
  let intelligibility: number;
  if (hasTranscript && wordCount >= 5) {
    intelligibility = 3.5 + Math.random() * 1.5;
  } else if (hasTranscript) {
    intelligibility = 2.5 + Math.random();
  } else if (likelySpoke) {
    intelligibility = 2 + Math.random() * 1.5;
  } else {
    intelligibility = 0.5;
  }

  // Accuracy (real accuracy comes from diff comparison, this is a placeholder)
  let accuracy: number;
  if (hasTranscript && wordCount >= 5) {
    accuracy = 3 + Math.random() * 2;
  } else if (hasTranscript) {
    accuracy = 2 + Math.random();
  } else if (likelySpoke) {
    accuracy = 2 + Math.random() * 1.5;
  } else {
    accuracy = 0.5;
  }

  // Clamp to 0-5
  fluency = Math.min(5, Math.max(0, Math.round(fluency * 10) / 10));
  intelligibility = Math.min(5, Math.max(0, Math.round(intelligibility * 10) / 10));
  accuracy = Math.min(5, Math.max(0, Math.round(accuracy * 10) / 10));
  const total = Math.round(((fluency + intelligibility + accuracy) / 3) * 10) / 10;

  // Feedback
  let feedback = '';
  if (!likelySpoke) {
    feedback = '녹음이 너무 짧습니다. 문장을 끝까지 말해보세요.';
  } else if (total >= 4) {
    feedback = '훌륭합니다! 자연스럽고 정확한 발화입니다. 👏';
  } else if (total >= 3) {
    feedback = '좋은 시도입니다. 좀 더 자연스러운 리듬으로 연습해보세요.';
  } else if (total >= 2) {
    feedback = '계속 연습하면 나아질 거예요. 원본을 다시 듣고 따라해보세요.';
  } else {
    feedback = '좋은 시작! 원본 음성을 집중해서 들어보세요.';
  }

  // Append STT status note
  if (!hasTranscript && likelySpoke) {
    feedback += ' (음성인식 미지원 브라우저입니다. 녹음 재생으로 확인하세요.)';
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseId,
    exerciseTitle,
    segmentIndex,
    timestamp: Date.now(),
    recordingDuration,
    userTranscript: transcript,
    scores: { fluency, intelligibility, accuracy, total },
    feedback,
  };
}
