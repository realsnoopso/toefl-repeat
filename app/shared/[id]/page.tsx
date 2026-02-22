'use client';

import { useEffect, useState, use, useCallback, useRef } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SharedData {
  id: string;
  createdAt: string;
  stats: { total: number; avg: number; best: number };
  attempts: PracticeAttempt[];
  audioUrls?: Record<string, string>;
}

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

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setData)
      .catch(() => setError('기록을 찾을 수 없습니다'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlay = useCallback((attemptId: string, url: string) => {
    // Stop any currently playing audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // If clicking the same item, just stop
    if (playingId === attemptId) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(attemptId);
    audio.onended = () => { setPlayingId(null); audioRef.current = null; };
    audio.onerror = () => { setPlayingId(null); audioRef.current = null; };
    audio.play().catch(() => { setPlayingId(null); audioRef.current = null; });
  }, [playingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-background">
        <p className="text-muted-foreground animate-pulse">불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background gap-4">
        <span className="text-4xl">😕</span>
        <p className="text-muted-foreground">{error || '기록을 찾을 수 없습니다'}</p>
        <Button onClick={() => window.location.href = '/'}>연습하러 가기</Button>
      </div>
    );
  }

  const audioUrls = data.audioUrls || {};

  // Group by date
  const grouped = new Map<string, PracticeAttempt[]>();
  for (const a of data.attempts) {
    const key = dateKey(a.timestamp);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(a);
  }
  const sortedGroups = Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">🎙️ TOEFL 연습 기록</h1>
          <p className="text-xs text-muted-foreground">
            {new Date(data.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 공유됨
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">총 연습</p>
            <p className="text-lg font-bold">{data.stats.total}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">평균</p>
            <p className="text-lg font-bold">{data.stats.avg.toFixed(1)}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">최고</p>
            <p className="text-lg font-bold text-emerald-600">{data.stats.best.toFixed(1)}</p>
          </Card>
        </div>

        {/* Grouped list */}
        <div className="space-y-5">
          {sortedGroups.map(([key, items]) => {
            const dayAvg = items.reduce((s, a) => s + a.scores.total, 0) / items.length;
            return (
              <div key={key}>
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
                <div className="space-y-2">
                  {items.map(a => {
                    const hasAudio = !!audioUrls[a.id];
                    const isPlaying = playingId === a.id;
                    return (
                      <Card
                        key={a.id}
                        className={`p-3 transition-colors ${hasAudio ? 'cursor-pointer hover:bg-muted/50 active:bg-muted' : ''}`}
                        onClick={() => {
                          if (hasAudio) handlePlay(a.id, audioUrls[a.id]);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {hasAudio && (
                                <span className="text-sm shrink-0">
                                  {isPlaying ? '🔊' : '▶️'}
                                </span>
                              )}
                              <p className="text-sm font-medium truncate">{a.exerciseTitle}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              구간 {a.segmentIndex + 1} · {new Date(a.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                              {a.recordingDuration > 0 && ` · ${a.recordingDuration.toFixed(1)}초`}
                            </p>
                            {a.userTranscript && (
                              <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed bg-muted/50 rounded px-2 py-1.5">
                                &ldquo;{a.userTranscript}&rdquo;
                              </p>
                            )}
                          </div>
                          <p className={`text-lg font-bold shrink-0 ml-3 ${a.scores.total >= 4 ? 'text-emerald-600' : a.scores.total >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                            {a.scores.total.toFixed(1)}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button onClick={() => window.location.href = '/'} size="lg">
            나도 연습하기 🎧
          </Button>
        </div>
      </div>
    </div>
  );
}
