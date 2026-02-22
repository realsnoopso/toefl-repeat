// Audio file base URL
export const BLOB_BASE = 'https://exnsm3lxtncyyrjr.public.blob.vercel-storage.com/audio';

// Exercise category
export type TaskType = 'diagnostic' | 'task1' | 'task2' | 'actual-test';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Audio segment (a pause point in the MP3)
export interface AudioSegment {
  start: number;   // seconds - play from here
  end: number;     // seconds - pause here for recording
  resumeAt: number; // seconds - resume playback from here
}

// Exercise (one MP3 file)
export interface Exercise {
  id: string;
  title: string;
  titleKo: string;
  taskType: TaskType;
  category: string;
  categoryKo: string;
  difficulty: Difficulty;
  audioUrl: string;
  duration: number;
  segments: AudioSegment[];
  qaClips?: { id: string; label: string; audioUrl: string }[];
}

// Practice attempt (one recording at one segment)
export interface PracticeAttempt {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  segmentIndex: number;
  timestamp: number;
  recordingDuration: number;
  userTranscript: string;
  scores: {
    fluency: number;
    intelligibility: number;
    accuracy: number;
    total: number;
  };
  feedback: string;
  recordingUrl?: string; // Vercel Blob URL of the recording
}

// Player state
export type PlayerState =
  | 'idle'        // not started
  | 'playing'     // audio playing
  | 'paused'      // user paused or auto-paused at segment boundary
  | 'recording'   // recording user voice
  | 'reviewing'   // showing recording result
  | 'finished';   // all segments done

// Navigation
export type TabId = 'practice' | 'history';
