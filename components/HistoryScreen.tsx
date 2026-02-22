'use client';

import { useState, useEffect, useCallback } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { getAttempts, clearAllData } from '@/lib/storage/localStorage';
import { getRecording, downloadRecording, getAllRecordingIds } from '@/lib/storage/recordingDB';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HistoryScreen() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [recordingIds, setRecordingIds] = useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setAttempts(getAttempts());
    getAllRecordingIds().then(ids => setRecordingIds(new Set(ids))).catch(() => {});
  }, []);

  const avgScore = attempts.length > 0 ? attempts.reduce((s, a) => s + a.scores.total, 0) / attempts.length : 0;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.scores.total)) : 0;

  const handlePlay = useCallback(async (id: string) => {
    const rec = await getRecording(id);
    if (!rec) return;
    const url = URL.createObjectURL(rec.blob);
    const audio = new Audio(url);
    setPlayingId(id);
    audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(url); };
    audio.onerror = () => { setPlayingId(null); URL.revokeObjectURL(url); };
    audio.play().catch(() => setPlayingId(null));
  }, []);

  const handleDownload = useCallback(async (attempt: PracticeAttempt) => {
    const rec = await getRecording(attempt.id);
    if (!rec) return;
    const ext = rec.mimeType.includes('webm') ? 'webm' : rec.mimeType.includes('mp4') ? 'mp4' : 'wav';
    const date = new Date(attempt.timestamp);
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const filename = `${attempt.exerciseId}_seg${attempt.segmentIndex + 1}_${dateStr}.${ext}`;
    downloadRecording(rec.blob, filename);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold">연습 기록</h1>
        <p className="text-sm text-muted-foreground">{attempts.length}회 연습</p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {attempts.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-muted-foreground">총 연습</p><p className="text-lg font-bold">{attempts.length}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-muted-foreground">평균</p><p className="text-lg font-bold">{avgScore.toFixed(1)}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-muted-foreground">최고</p><p className="text-lg font-bold text-emerald-600">{bestScore.toFixed(1)}</p></Card>
          </div>
        )}
        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <span className="text-4xl mb-4">📝</span>
            <p className="text-sm">아직 연습 기록이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attempts.map(a => {
              const hasRecording = recordingIds.has(a.id);
              const isPlaying = playingId === a.id;
              return (
                <Card key={a.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{a.exerciseTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        구간 {a.segmentIndex + 1} · {new Date(a.timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {a.recordingDuration > 0 && ` · ${a.recordingDuration.toFixed(1)}초`}
                      </p>
                      {a.userTranscript && (
                        <p className="text-xs text-muted-foreground mt-1 italic truncate">
                          &ldquo;{a.userTranscript}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {hasRecording && (
                        <>
                          <button
                            onClick={() => handlePlay(a.id)}
                            disabled={isPlaying}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs hover:bg-muted/80 transition-colors disabled:opacity-50"
                            title="재생"
                          >
                            {isPlaying ? '🔊' : '▶️'}
                          </button>
                          <button
                            onClick={() => handleDownload(a)}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs hover:bg-muted/80 transition-colors"
                            title="다운로드"
                          >
                            ⬇️
                          </button>
                        </>
                      )}
                      <p className={`text-lg font-bold w-10 text-right ${a.scores.total >= 4 ? 'text-emerald-600' : a.scores.total >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                        {a.scores.total.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {attempts.length > 0 && (
          <Button variant="ghost" className="w-full text-xs text-muted-foreground"
            onClick={() => { if (confirm('모든 기록을 삭제하시겠습니까?')) { clearAllData(); setAttempts([]); } }}>전체 기록 삭제</Button>
        )}
      </div>
    </div>
  );
}
