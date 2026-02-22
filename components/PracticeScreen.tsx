'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Exercise, PracticeState } from '@/lib/types';
import { playBeep } from '@/lib/audio/beep';
import { AudioRecorder } from '@/lib/audio/recorder';
import { evaluateAttempt } from '@/lib/evaluation/scoring';
import { saveAttempt, getAttemptsForExercise } from '@/lib/storage/localStorage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

export function PracticeScreen({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  const [state, setState] = useState<PracticeState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof evaluateAttempt> | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [attempts, setAttempts] = useState(() => getAttemptsForExercise(exercise.id));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const startPractice = useCallback(async () => {
    setState('playing');
    setAudioProgress(0);

    const audio = new Audio(exercise.audioUrl);
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener('ended', async () => {
      // 3 second countdown
      setState('waiting');
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(r => setTimeout(r, 1000));
      }

      // Beep
      setState('beep');
      await playBeep(800, 0.3);
      await new Promise(r => setTimeout(r, 200));

      // Start recording
      setState('recording');
      setRecordingTime(0);
      startTimeRef.current = Date.now();
      try {
        await recorderRef.current.start();
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime((Date.now() - startTimeRef.current) / 1000);
        }, 100);
      } catch (err) {
        console.error('Mic error:', err);
        setState('idle');
      }
    });

    audio.play().catch(err => {
      console.error('Audio play error:', err);
      setState('idle');
    });
  }, [exercise]);

  const stopRecording = useCallback(async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setState('analyzing');
    const duration = (Date.now() - startTimeRef.current) / 1000;

    try {
      await recorderRef.current.stop();
    } catch {
      // ignore
    }

    // Try STT via Web Speech API
    let transcript = '';
    try {
      const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition || 
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // STT not available after recording, use simple estimation
        transcript = '(speech detected)';
      }
    } catch {
      // no STT
    }

    // Evaluate
    const attempt = evaluateAttempt(exercise.id, exercise.titleKo, duration, transcript);
    saveAttempt(attempt);
    setResult(attempt);
    setAttempts(getAttemptsForExercise(exercise.id));
    setState('result');
  }, [exercise]);

  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setAudioProgress(0);
    setRecordingTime(0);
  }, []);

  const bestScore = attempts.length > 0
    ? Math.max(...attempts.map(a => a.scores.total))
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-1 -ml-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h2 className="text-sm font-medium truncate">{exercise.titleKo}</h2>
          <p className="text-xs text-muted-foreground">{exercise.categoryKo}</p>
        </div>
        {bestScore !== null && (
          <span className="ml-auto text-xs text-muted-foreground">최고 {bestScore.toFixed(1)}</span>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <AnimatePresence mode="wait">
          {/* IDLE */}
          {state === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">🎧</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">음성을 듣고 따라 말하세요</p>
                <p className="text-xs text-muted-foreground">MP3 재생 → 3초 대기 → 비프음 → 녹음</p>
              </div>
              <Button onClick={startPractice} size="lg" className="w-full max-w-xs">
                ▶ 시작하기
              </Button>
              {exercise.qaClips && exercise.qaClips.length > 0 && (
                <div className="w-full">
                  <p className="text-xs text-muted-foreground mb-2">모범 답안 듣기</p>
                  <div className="grid grid-cols-4 gap-2">
                    {exercise.qaClips.map(clip => (
                      <button
                        key={clip.id}
                        onClick={() => new Audio(clip.audioUrl).play()}
                        className="text-xs px-2 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
                      >
                        {clip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PLAYING */}
          {state === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <span className="text-4xl">🔊</span>
              </motion.div>
              <p className="text-sm font-medium">재생 중... 집중해서 들으세요</p>
              <div className="w-full">
                <Progress value={audioProgress} className="h-1.5" />
              </div>
            </motion.div>
          )}

          {/* WAITING (countdown) */}
          {state === 'waiting' && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-sm text-muted-foreground">준비하세요!</p>
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold"
              >
                {countdown}
              </motion.span>
            </motion.div>
          )}

          {/* BEEP */}
          {state === 'beep' && (
            <motion.div key="beep" initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center"
              >
                <span className="text-3xl">🔔</span>
              </motion.div>
            </motion.div>
          )}

          {/* RECORDING */}
          {state === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 20px rgba(239,68,68,0.1)', '0 0 0 0 rgba(239,68,68,0)'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center"
              >
                <span className="text-4xl">🎙️</span>
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium text-red-600">녹음 중</p>
                <p className="text-2xl font-mono font-bold mt-1">{recordingTime.toFixed(1)}s</p>
              </div>
              <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full max-w-xs">
                ⏹ 녹음 중지
              </Button>
            </motion.div>
          )}

          {/* ANALYZING */}
          {state === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-2 border-muted-foreground border-t-transparent rounded-full"
              />
              <p className="text-sm text-muted-foreground">분석 중...</p>
            </motion.div>
          )}

          {/* RESULT */}
          {state === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-sm"
            >
              <Card className="w-full p-6">
                {/* Total score */}
                <div className="text-center mb-4">
                  <p className="text-xs text-muted-foreground mb-1">종합 점수</p>
                  <p className={`text-5xl font-bold ${
                    result.scores.total >= 4 ? 'text-emerald-600' :
                    result.scores.total >= 3 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {result.scores.total.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
                </div>

                {/* Score breakdown */}
                <div className="space-y-3">
                  {[
                    { label: '유창성', value: result.scores.fluency, color: 'bg-blue-500' },
                    { label: '명료성', value: result.scores.intelligibility, color: 'bg-emerald-500' },
                    { label: '정확도', value: result.scores.accuracy, color: 'bg-violet-500' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-medium">{s.value.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.value / 5) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-sm text-center mt-4 text-muted-foreground">{result.feedback}</p>
              </Card>

              <div className="flex gap-3 w-full">
                <Button onClick={reset} variant="outline" className="flex-1">다시 연습</Button>
                <Button onClick={onBack} variant="secondary" className="flex-1">목록으로</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
