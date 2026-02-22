'use client';

import { useEffect, useState } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { getAttempts } from '@/lib/storage/localStorage';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

export function HistoryScreen() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);

  useEffect(() => {
    const loadedAttempts = getAttempts();
    setAttempts(loadedAttempts);
  }, []);

  if (attempts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-6xl">📊</div>
            <h3 className="text-lg font-semibold">연습 기록이 없습니다</h3>
            <p className="text-sm text-muted-foreground">
              연습을 시작하면 여기에 기록이 표시됩니다!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAttempts = attempts.length;
  const averageScore =
    attempts.reduce((sum, a) => sum + a.scores.total, 0) / attempts.length;
  const bestScore = Math.max(...attempts.map(a => a.scores.total));

  return (
    <div className="h-full flex flex-col">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold">학습 기록</h1>
        <p className="text-sm text-muted-foreground">연습 통계 및 기록</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm">📊 전체 통계</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{totalAttempts}</p>
                <p className="text-xs text-muted-foreground">총 연습</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{averageScore.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">평균 점수</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{bestScore.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">최고 점수</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attempts list */}
        <div>
          <h3 className="font-medium text-sm mb-2 px-1">최근 연습 ({totalAttempts}개)</h3>
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-2">
              {attempts
                .slice()
                .reverse()
                .map((attempt, idx) => {
                  const date = new Date(attempt.timestamp);
                  const scoreColor =
                    attempt.scores.total >= 4
                      ? 'text-emerald-600'
                      : attempt.scores.total >= 3
                      ? 'text-amber-600'
                      : 'text-muted-foreground';
                  
                  return (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{attempt.exerciseTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {date.toLocaleDateString('ko-KR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`text-lg font-bold ${scoreColor}`}>
                                {attempt.scores.total.toFixed(1)}
                              </p>
                              <div className="flex gap-1 text-[10px] text-muted-foreground">
                                <span>F {attempt.scores.fluency.toFixed(1)}</span>
                                <span>I {attempt.scores.intelligibility.toFixed(1)}</span>
                                <span>A {attempt.scores.accuracy.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          {attempt.feedback && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                              {attempt.feedback}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
