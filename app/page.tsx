'use client';

import { useState, useEffect, useCallback } from 'react';
import { TabId, Exercise } from '@/lib/types';
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

  // On mount, check URL for shared exercise
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
              <HistoryScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav
        active={tab}
        onChange={(t) => {
          setTab(t);
          if (t !== 'practice') selectExercise(null);
        }}
      />
    </div>
  );
}
