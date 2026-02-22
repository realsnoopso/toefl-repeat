'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { getAttempts, clearAllData } from '@/lib/storage/localStorage';
import { getRecording, downloadRecording, getAllRecordingIds } from '@/lib/storage/recordingDB';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function dateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateLabel(key: string): string {
  const today = dateKey(Date.now());
  const yesterday = dateKey(Date.now() - 86400000);
  if (key === today) return '오늘';
  if (key === yesterday) return '어제';
  const [, m, d] = key.split('-');
  return `${parseInt(m)}월 ${parseInt(d)}일`;
}

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

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, PracticeAttempt[]>();
    for (const a of attempts) {
      const key = dateKey(a.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [attempts]);

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
    const ds = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const filename = `${attempt.exerciseId}_seg${attempt.segmentIndex + 1}_${ds}.${ext}`;
    downloadRecording(rec.blob, filename);
  }, []);

  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      // Upload to server
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempts,
          stats: { total: attempts.length, avg: avgScore, best: bestScore },
        }),
      });
      const { id } = await res.json();
      const shareUrl = `${window.location.origin}/shared/${id}`;

      const text = `🎙️ TOEFL 연습 기록\n📊 ${attempts.length}회 연습, 평균 ${avgScore.toFixed(1)}점, 최고 ${bestScore.toFixed(1)}점\n\n👉 ${shareUrl}`;

      if (navigator.share) {
        try { await navigator.share({ title: 'TOEFL 연습 기록', text, url: shareUrl }); } catch { /* cancelled */ }
      } else {
        await navigator.clipboard.writeText(text);
        alert('공유 링크가 복사되었습니다!');
      }
    } catch {
      alert('공유 링크 생성에 실패했습니다.');
    } finally {
      setSharing(false);
    }
  }, [attempts, avgScore, bestScore]);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold">연습 기록</h1>
          <p className="text-sm text-muted-foreground">{attempts.length}회 연습</p>
        </div>
        {attempts.length > 0 && (
          <button
            onClick={handleShare}
            disabled={sharing}
            className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            title="기록 공유"
          >
            {sharing ? (
              <span className="text-xs animate-spin">⏳</span>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        )}
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
          <div className="space-y-5">
            {grouped.map(([key, items]) => {
              const dayAvg = items.reduce((s, a) => s + a.scores.total, 0) / items.length;
              return (
                <div key={key}>
                  {/* Date header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{dateLabel(key)}</h3>
                      <span className="text-xs text-muted-foreground">{key}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{items.length}회</span>
                      <span className={`font-medium ${dayAvg >= 4 ? 'text-emerald-600' : dayAvg >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                        평균 {dayAvg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {/* Items */}
                  <div className="space-y-2">
                    {items.map(a => {
                      const hasRecording = recordingIds.has(a.id);
                      const isPlaying = playingId === a.id;
                      return (
                        <Card key={a.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{a.exerciseTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                구간 {a.segmentIndex + 1} · {new Date(a.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
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
                </div>
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
