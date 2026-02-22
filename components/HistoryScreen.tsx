'use client';

import { useState, useEffect } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { getAttempts, clearAllData } from '@/lib/storage/localStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HistoryScreen() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);

  useEffect(() => {
    setAttempts(getAttempts());
  }, []);

  const avgScore = attempts.length > 0
    ? attempts.reduce((sum, a) => sum + a.scores.total, 0) / attempts.length
    : 0;

  const bestScore = attempts.length > 0
    ? Math.max(...attempts.map(a => a.scores.total))
    : 0;

  return (
    <div className="h-full flex flex-col">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold">연습 기록</h1>
        <p className="text-sm text-muted-foreground">{attempts.length}회 연습</p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {attempts.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xs text-muted-foreground">총 연습</p>
              <p className="text-lg font-bold">{attempts.length}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xs text-muted-foreground">평균 점수</p>
              <p className="text-lg font-bold">{avgScore.toFixed(1)}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xs text-muted-foreground">최고 점수</p>
              <p className="text-lg font-bold text-emerald-600">{bestScore.toFixed(1)}</p>
            </Card>
          </div>
        )}
        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <span className="text-4xl mb-4">📝</span>
            <p className="text-sm">아직 연습 기록이 없습니다</p>
            <p className="text-xs mt-1">연습 탭에서 시작해보세요!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attempts.map(a => (
              <Card key={a.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.exerciseTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.timestamp).toLocaleDateString('ko-KR', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                      {' · '}{a.recordingDuration.toFixed(1)}초
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className={`text-lg font-bold ${
                      a.scores.total >= 4 ? 'text-emerald-600' :
                      a.scores.total >= 3 ? 'text-amber-600' : 'text-red-600'
                    }`}>{a.scores.total.toFixed(1)}</p>
                    <div className="flex gap-1 text-[10px] text-muted-foreground">
                      <span>F:{a.scores.fluency.toFixed(1)}</span>
                      <span>I:{a.scores.intelligibility.toFixed(1)}</span>
                      <span>A:{a.scores.accuracy.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {attempts.length > 0 && (
          <Button variant="ghost" className="w-full text-xs text-muted-foreground"
            onClick={() => { if (confirm('모든 기록 삭제?')) { clearAllData(); setAttempts([]); } }}>
            전체 기록 삭제
          </Button>
        )}
      </div>
    </div>
  );
}
