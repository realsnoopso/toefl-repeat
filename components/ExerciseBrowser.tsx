'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/types';
import { exerciseSections } from '@/lib/data/exercises';
import { getBestScore } from '@/lib/storage/localStorage';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const difficultyColors = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const difficultyLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

export function ExerciseBrowser({ onSelect }: { onSelect: (e: Exercise) => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>('t1-basic');

  return (
    <div className="h-full flex flex-col">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold">TOEFL Speaking</h1>
        <p className="text-sm text-muted-foreground">Listen & Repeat 연습</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {exerciseSections.map(section => (
          <div key={section.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{section.titleKo}</span>
                <span className="text-xs text-muted-foreground">({section.exercises.length})</span>
              </div>
              <svg
                className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border"
              >
                <div className="p-2 space-y-1">
                  {section.exercises.map(ex => {
                    const best = getBestScore(ex.id);
                    return (
                      <button
                        key={ex.id}
                        onClick={() => onSelect(ex)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm truncate">{ex.titleKo}</span>
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${difficultyColors[ex.difficulty]}`}>
                            {difficultyLabels[ex.difficulty]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {best !== null && (
                            <span className={`text-xs font-medium ${best >= 4 ? 'text-emerald-600' : best >= 3 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                              {best.toFixed(1)}
                            </span>
                          )}
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
