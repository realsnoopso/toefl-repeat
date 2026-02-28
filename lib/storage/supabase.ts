import { createClient } from '@supabase/supabase-js';
import { PracticeAttempt } from '../types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveAttemptToSupabase(attempt: PracticeAttempt): Promise<void> {
  const { error } = await supabase.from('attempts').upsert({
    id: attempt.id,
    exercise_id: attempt.exerciseId,
    exercise_title: attempt.exerciseTitle,
    segment_index: attempt.segmentIndex,
    timestamp: attempt.timestamp,
    recording_duration: attempt.recordingDuration,
    user_transcript: attempt.userTranscript,
    scores: attempt.scores,
    feedback: attempt.feedback,
    recording_url: attempt.recordingUrl || null,
  });
  if (error) console.error('Failed to save attempt to Supabase:', error);
}

export async function getAttemptsFromSupabase(): Promise<PracticeAttempt[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Failed to fetch attempts:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    exerciseId: row.exercise_id as string,
    exerciseTitle: row.exercise_title as string,
    segmentIndex: row.segment_index as number,
    timestamp: Number(row.timestamp),
    recordingDuration: row.recording_duration as number,
    userTranscript: row.user_transcript as string,
    scores: row.scores as PracticeAttempt['scores'],
    feedback: row.feedback as string,
    recordingUrl: (row.recording_url as string) || undefined,
  }));
}

export async function getAttemptsForExerciseFromSupabase(exerciseId: string): Promise<PracticeAttempt[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Failed to fetch attempts for exercise:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    exerciseId: row.exercise_id as string,
    exerciseTitle: row.exercise_title as string,
    segmentIndex: row.segment_index as number,
    timestamp: Number(row.timestamp),
    recordingDuration: row.recording_duration as number,
    userTranscript: row.user_transcript as string,
    scores: row.scores as PracticeAttempt['scores'],
    feedback: row.feedback as string,
    recordingUrl: (row.recording_url as string) || undefined,
  }));
}

export async function clearAllSupabaseData(): Promise<void> {
  const { error } = await supabase.from('attempts').delete().neq('id', '');
  if (error) console.error('Failed to clear attempts:', error);
}
