'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeAttempt } from '@/lib/types';
import { getAttempts, clearAllData } from '@/lib/storage/localStorage';
import { getAttemptsFromSupabase, clearAllSupabaseData, saveAttemptToSupabase } from '@/lib/storage/supabase';
import { getRecording, downloadRecording, getAllRecordingIds, getAllRecordings } from '@/lib/storage/recordingDB';
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

interface HistoryScreenProps {
  sharedAttempts?: PracticeAttempt[];
  isShared?: boolean;
}

export function HistoryScreen({ sharedAttempts, isShared }: HistoryScreenProps = {}) {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>(sharedAttempts || []);
  const [recordingIds, setRecordingIds] = useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (sharedAttempts) return; // Don't fetch if shared data provided
    // Load from Supabase (primary), fall back to localStorage
    getAttemptsFromSupabase().then(data => {
      if (data.length > 0) {
        setAttempts(data);
      } else {
        setAttempts(getAttempts());
      }
    }).catch(() => {
      setAttempts(getAttempts());
    });
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

  const handlePlay = useCallback(async (id: string, recordingUrl?: string) => {
    // Prefer server URL (always works), fall back to IndexedDB
    if (recordingUrl) {
      const audio = new Audio(recordingUrl);
      setPlayingId(id);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      audio.play().catch(() => setPlayingId(null));
      return;
    }
    const rec = await getRecording(id).catch(() => null);
    if (rec && rec.blob && rec.blob.size > 0) {
      const url = URL.createObjectURL(rec.blob);
      const audio = new Audio(url);
      setPlayingId(id);
      audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(url); };
      audio.onerror = () => { setPlayingId(null); URL.revokeObjectURL(url); };
      audio.play().catch(() => setPlayingId(null));
    }
  }, []);

  const handleDownload = useCallback(async (attempt: PracticeAttempt) => {
    // Try IndexedDB first, fall back to server URL
    const rec = await getRecording(attempt.id).catch(() => null);
    if (rec && rec.blob && rec.blob.size > 0) {
      const ext = rec.mimeType.includes('webm') ? 'webm' : rec.mimeType.includes('mp4') ? 'mp4' : 'wav';
      const date = new Date(attempt.timestamp);
      const ds = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
      const filename = `${attempt.exerciseId}_seg${attempt.segmentIndex + 1}_${ds}.${ext}`;
      downloadRecording(rec.blob, filename);
    } else if (attempt.recordingUrl) {
      // Download from server URL
      const a = document.createElement('a');
      a.href = attempt.recordingUrl;
      a.download = `${attempt.exerciseId}_seg${attempt.segmentIndex + 1}.webm`;
      a.click();
    }
  }, []);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = useCallback(async () => {
    setShareLoading(true);
    try {
      // Upload any local recordings that don't have a recording_url yet
      const needsUpload = attempts.filter(a => !a.recordingUrl && recordingIds.has(a.id));
      console.log(`[Share] Need to upload ${needsUpload.length} recordings (total attempts: ${attempts.length}, with recordingUrl: ${attempts.filter(a => !!a.recordingUrl).length}, in IndexedDB: ${recordingIds.size})`);
      let uploaded = 0;
      for (const attempt of needsUpload) {
        try {
          const rec = await getRecording(attempt.id);
          if (!rec) { console.log(`[Share] No recording in IndexedDB for ${attempt.id}`); continue; }
          console.log(`[Share] Uploading ${attempt.id} (${rec.blob.size} bytes)`);
          const fd = new FormData();
          fd.append('attemptId', attempt.id);
          fd.append('file', rec.blob, `${attempt.id}.webm`);
          const uploadRes = await fetch('/api/recording', { method: 'POST', body: fd });
          if (uploadRes.ok) {
            const { url: blobUrl } = await uploadRes.json();
            attempt.recordingUrl = blobUrl;
            await saveAttemptToSupabase(attempt);
            const key = 'toefl-repeat-attempts';
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            const idx = stored.findIndex((s: { id: string }) => s.id === attempt.id);
            if (idx >= 0) { stored[idx].recordingUrl = blobUrl; localStorage.setItem(key, JSON.stringify(stored)); }
            uploaded++;
          } else {
            const errText = await uploadRes.text();
            console.error(`[Share] Upload failed for ${attempt.id}:`, uploadRes.status, errText);
          }
        } catch (e) { console.error(`[Share] Upload error for ${attempt.id}:`, e); }
      }
      console.log(`[Share] Uploaded ${uploaded}/${needsUpload.length} recordings`);

      const attemptIds = attempts.map(a => a.id);
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptIds }),
      });
      if (!res.ok) throw new Error('Share create failed');
      const { id } = await res.json();
      setShareUrl(`${window.location.origin}/?share=${id}`);
    } catch {
      alert('링크 생성에 실패했습니다.');
    } finally {
      setShareLoading(false);
    }
  }, [attempts, recordingIds]);

  const copyShareLink = useCallback(async () => {
    if (!shareUrl) return;
    const text = `🎙️ TOEFL 연습 기록\n📊 ${attempts.length}회 연습, 평균 ${avgScore.toFixed(1)}점, 최고 ${bestScore.toFixed(1)}점\n\n👉 ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('복사에 실패했습니다.');
    }
  }, [shareUrl, attempts, avgScore, bestScore]);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold">{isShared ? '공유된 연습 기록' : '연습 기록'}</h1>
          <p className="text-sm text-muted-foreground">{attempts.length}회 연습</p>
        </div>
        {attempts.length > 0 && !isShared && (
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title="기록 공유"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
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
                      const hasRecording = recordingIds.has(a.id) || !!a.recordingUrl;
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
                                <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed bg-muted/50 rounded px-2 py-1.5">
                                  &ldquo;{a.userTranscript}&rdquo;
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {hasRecording && (
                                <>
                                  <button
                                    onClick={() => handlePlay(a.id, a.recordingUrl)}
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
        {attempts.length > 0 && !isShared && (
          <Button variant="ghost" className="w-full text-xs text-muted-foreground"
            onClick={() => { if (confirm('모든 기록을 삭제하시겠습니까?')) { clearAllData(); clearAllSupabaseData(); setAttempts([]); } }}>전체 기록 삭제</Button>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowShareModal(false); setShareUrl(null); setCopied(false); }} />
          <div className="relative bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">기록 공유</h2>
              <button onClick={() => { setShowShareModal(false); setShareUrl(null); setCopied(false); }} className="p-1 rounded-md hover:bg-muted">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              공유 링크를 생성하면 누구나 내 연습 기록을 볼 수 있어요.
            </p>

            {!shareUrl ? (
              <Button
                onClick={generateShareLink}
                disabled={shareLoading}
                className="w-full"
              >
                {shareLoading ? '생성 중...' : '🔗 퍼블릭 링크 생성'}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground truncate flex-1">{shareUrl}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyShareLink} className="flex-1">
                    {copied ? '✅ 복사됨!' : '📋 링크 복사'}
                  </Button>
                  <Button variant="outline" onClick={generateShareLink} disabled={shareLoading}>
                    {shareLoading ? '...' : '🔄'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
