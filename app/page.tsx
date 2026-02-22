'use client';

import { useState } from 'react';
import { TabId, Exercise } from '@/lib/types';
import { ExerciseBrowser } from '@/components/ExerciseBrowser';
import { PracticeScreen } from '@/components/PracticeScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { BottomNav } from '@/components/BottomNav';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [tab, setTab] = useState<TabId>('practice');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
              <ExerciseBrowser onSelect={setSelectedExercise} />
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
                onBack={() => setSelectedExercise(null)}
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
          if (t !== 'practice') setSelectedExercise(null);
        }}
      />
    </div>
  );
}
