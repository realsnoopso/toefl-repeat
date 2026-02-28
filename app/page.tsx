'use client';

import { useState, useEffect, useCallback } from 'react';
import { TabId, Exercise, PracticeAttempt } from '@/lib/types';
import { allExercises } from '@/lib/data/exercises';
import { ExerciseBrowser } from '@/components/ExerciseBrowser';
import { PracticeScreen } from '@/components/PracticeScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { BottomNav } from '@/components/BottomNav';
import { AnimatePresence, motion } from 'framer-motion';
export default function Home() {
  const [tab, setTab] = useState<TabId>('practice');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedAttempts, setSharedAttempts] = useState<PracticeAttempt[] | undefined>(undefined);

  // On mount, check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Shared view: ?share=<id>
    const shareId = params.get('share');
    if (shareId) {
      setTab('history');
      setIsSharedView(true);
      fetch(`/api/share?id=${shareId}`)
        .then(r => r.json())
        .then(data => {
          if (data.attempts) {
            const mapped = data.attempts.map((row: Record<string, unknown>) => ({
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
            setSharedAttempts(mapped);
          }
          setInitialized(true);
        })
        .catch(() => setInitialized(true));
      return;
    }

    const tabParam = params.get('tab');
    if (tabParam === 'history') {
      setTab('history');
      setIsSharedView(true);
    }
    const exId = params.get('ex');
    if (exId) {
      const exercise = allExercises.find(e => e.id === exId);
      if (exercise) {
        setSelectedExercise(exercise);
        setTab('practice');
      }
    }
    setInitialized(true);
  }, []);

  // Update URL when exercise changes
  const selectExercise = useCallback((exercise: Exercise | null) => {
    setSelectedExercise(exercise);
    if (exercise) {
      window.history.replaceState(null, '', `?ex=${exercise.id}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (!initialized) return null;

  return (
    <div className="flex flex-col h-dvh bg-background">
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === 'practice' && !selectedExercise && (
            <motion.div
              key="browser"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <ExerciseBrowser onSelect={selectExercise} />
            </motion.div>
          )}
          {tab === 'practice' && selectedExercise && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <PracticeScreen
                exercise={selectedExercise}
                onBack={() => selectExercise(null)}
              />
            </motion.div>
          )}
          {tab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <HistoryScreen sharedAttempts={sharedAttempts} isShared={isSharedView} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {!isSharedView && (
        <BottomNav
          active={tab}
          onChange={(t) => {
            setTab(t);
            if (t !== 'practice') selectExercise(null);
          }}
        />
      )}
    </div>
  );
}
