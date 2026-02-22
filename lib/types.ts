// Audio file base URL
export const BLOB_BASE = 'https://exnsm3lxtncyyrjr.public.blob.vercel-storage.com/audio';

// Exercise category
export type TaskType = 'diagnostic' | 'task1' | 'task2' | 'actual-test';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Exercise (one MP3 file = one exercise set)
export interface Exercise {
  id: string;
  title: string;
  titleKo: string;
  taskType: TaskType;
  category: string;
  categoryKo: string;
  difficulty: Difficulty;
  audioUrl: string;
  // For task2, qa-model clips
  qaClips?: { id: string; label: string; audioUrl: string }[];
}

// Practice attempt
export interface PracticeAttempt {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  timestamp: number;
  recordingDuration: number;
  userTranscript: string;
  scores: {
    fluency: number;       // 0-5
    intelligibility: number; // 0-5
    accuracy: number;      // 0-5
    total: number;         // average
  };
  feedback: string;
}

// Practice state machine
export type PracticeState =
  | 'idle'
  | 'playing'
  | 'waiting'
  | 'beep'
  | 'recording'
  | 'analyzing'
  | 'result';

// Navigation
export type TabId = 'practice' | 'history';
