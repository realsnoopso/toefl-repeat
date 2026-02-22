'use client';

import { useState, useEffect, useRef } from 'react';
import { Sentence, PracticeState, PracticeAttempt } from '@/lib/types';
import { sampleSentences, getSentenceById } from '@/lib/data/sentences';
import { playBeep } from '@/lib/audio/beep';
import { speakText, stopSpeaking } from '@/lib/audio/tts';
import { startSpeechRecognition, STTResult } from '@/lib/audio/stt';
import { calculateFluency, calculateIntelligibility, calculateAccuracy, calculateTotalScore, generateFeedback, calculateMetrics } from '@/lib/evaluation/scoring';
import { saveAttempt, getBestScoreBySentence } from '@/lib/storage/localStorage';
import { SentenceList } from './SentenceList';
import { SentenceDetail } from './SentenceDetail';
import { AudioPlayer } from './AudioPlayer';
import { CountdownOverlay } from './CountdownOverlay';
import { BeepIndicator } from './BeepIndicator';
import { RecordingController } from './RecordingController';
import { AnalyzingIndicator } from './AnalyzingIndicator';
import { ScoreCard } from './ScoreCard';

export function PracticeView() {
  const [currentState, setCurrentState] = useState<PracticeState>('idle');
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<PracticeAttempt | null>(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingMessage, setAnalyzingMessage] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const responseLatencyRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const sttConfidenceRef = useRef<number>(0.9);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');

  // 문장 선택
  const handleSelectSentence = (sentence: Sentence) => {
    setSelectedSentence(sentence);
    setEvaluationResult(null);
  };

  // Play 버튼 클릭
  const handlePlay = async () => {
    if (!selectedSentence) return;
    
    setCurrentState('playing');
    
    try {
      // TTS로 문장 읽기
      await speakText(selectedSentence.text);
      
      // 3초 대기 상태로 전환
      setCurrentState('waiting');
      setCountdown(3);
    } catch (error) {
      console.error('TTS error:', error);
      alert('Failed to play audio. Please try again.');
      setCurrentState('idle');
    }
  };

  // Countdown 효과
  useEffect(() => {
    if (currentState !== 'waiting') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Beep 재생
          setCurrentState('beep');
          playBeep().then(() => {
            // 녹음 시작
            setCurrentState('recording');
            startRecording();
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentState]);

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      recordingStartTimeRef.current = Date.now();
      
      // Response latency 측정 (비프음 이후 첫 발화까지)
      responseLatencyRef.current = 0;
      
      // 녹음 시간 카운터
      const durationTimer = setInterval(() => {
        setRecordingDuration(Date.now() - recordingStartTimeRef.current);
      }, 100);
      
      // STT 시작 (실시간)
      recognitionRef.current = startSpeechRecognition(
        (result: STTResult) => {
          // final 결과만 저장 (중간 결과는 무시)
          if (result.isFinal) {
            transcriptRef.current = result.transcript;
            sttConfidenceRef.current = result.confidence;
          }
          
          // Response latency 측정 (첫 단어 인식 시)
          if (responseLatencyRef.current === 0 && result.transcript.trim().length > 0) {
            responseLatencyRef.current = Date.now() - recordingStartTimeRef.current;
          }
        },
        (error: any) => {
          console.error('STT error:', error);
          // STT 에러 시 수동 입력 모드로 전환 준비
        }
      );
      
      mediaRecorder.onstop = () => {
        clearInterval(durationTimer);
        stream.getTracks().forEach(track => track.stop());
        
        // 분석 시작
        analyzeRecording();
      };
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to access microphone. Please grant permission.');
      setCurrentState('idle');
    }
  };

  // 녹음 중지
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      if (recognitionRef.current) {
        // recognition을 중지하고 결과를 기다림
        recognitionRef.current.stop();
        
        // recognition의 onend 이벤트에서 분석 시작
        recognitionRef.current.onend = () => {
          // 약간의 딜레이 후 transcript 확인
          setTimeout(() => {
            if (transcriptRef.current.trim().length === 0) {
              // transcript가 비어있으면 수동 입력 모드
              setManualInputMode(true);
              setCurrentState('idle');
            }
            // transcript가 있으면 analyzeRecording이 mediaRecorder.onstop에서 호출됨
          }, 300);
        };
      }
    }
  };

  // 녹음 분석
  const analyzeRecording = async () => {
    if (!selectedSentence) return;
    
    // transcript가 비어있으면 수동 입력 모드로 전환
    if (transcriptRef.current.trim().length === 0) {
      setManualInputMode(true);
      setCurrentState('idle');
      return;
    }
    
    setCurrentState('analyzing');
    setAnalyzingProgress(0);
    setAnalyzingMessage('Processing your speech...');
    
    try {
      // 진행률 시뮬레이션
      setAnalyzingProgress(30);
      setAnalyzingMessage('Converting speech to text...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalyzingProgress(60);
      setAnalyzingMessage('Evaluating fluency...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalyzingProgress(90);
      setAnalyzingMessage('Calculating scores...');
      
      // 평가 계산
      const userTranscript = transcriptRef.current || '';
      const responseLatency = responseLatencyRef.current || 0;
      const duration = recordingDuration;
      
      // 점수 계산
      const fluencyScore = calculateFluency({
        responseLatency,
        pauseCount: 0, // TODO: 실제 pause 감지
        recordingDuration: duration
      });
      
      const intelligibilityScore = calculateIntelligibility({
        sttConfidence: sttConfidenceRef.current,
        transcript: userTranscript,
        originalWords: selectedSentence.text.split(/\s+/)
      });
      
      const accuracyScore = calculateAccuracy({
        userTranscript,
        originalSentence: selectedSentence
      });
      
      const totalScore = calculateTotalScore({
        fluency: fluencyScore,
        intelligibility: intelligibilityScore,
        accuracy: accuracyScore
      });
      
      const feedback = generateFeedback({
        fluency: fluencyScore,
        intelligibility: intelligibilityScore,
        accuracy: accuracyScore,
        total: totalScore
      });
      
      const metrics = calculateMetrics({
        userTranscript,
        originalSentence: selectedSentence
      });
      
      // PracticeAttempt 생성
      const attempt: PracticeAttempt = {
        id: `attempt-${Date.now()}`,
        sentenceId: selectedSentence.id,
        sentenceText: selectedSentence.text,
        timestamp: new Date(),
        recordingDuration: duration,
        userTranscript,
        responseLatency,
        scores: {
          fluency: fluencyScore,
          intelligibility: intelligibilityScore,
          accuracy: accuracyScore,
          total: totalScore
        },
        metrics,
        feedback
      };
      
      // localStorage에 저장
      saveAttempt(attempt);
      
      setAnalyzingProgress(100);
      setEvaluationResult(attempt);
      setCurrentState('result');
      
      // 리셋
      transcriptRef.current = '';
      sttConfidenceRef.current = 0.9;
      setRecordingDuration(0);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze recording. Please try again.');
      setCurrentState('idle');
    }
  };

  // Try Again
  const handleTryAgain = () => {
    setCurrentState('idle');
    setEvaluationResult(null);
  };

  // Next Sentence
  const handleNextSentence = () => {
    setSelectedSentence(null);
    setCurrentState('idle');
    setEvaluationResult(null);
  };

  // View History
  const handleViewHistory = () => {
    // TODO: Navigate to history page
    window.location.href = '/history';
  };

  // 수동 입력 제출
  const handleManualSubmit = () => {
    if (manualTranscript.trim().length === 0) {
      alert('Please enter your spoken text.');
      return;
    }
    
    transcriptRef.current = manualTranscript.trim();
    sttConfidenceRef.current = 0.5; // 수동 입력은 낮은 confidence
    setManualInputMode(false);
    setManualTranscript('');
    analyzeRecording();
  };

  // 수동 입력 취소
  const handleManualCancel = () => {
    setManualInputMode(false);
    setManualTranscript('');
    setCurrentState('idle');
  };

  return (
    <div className="container max-w-[600px] mx-auto px-4 py-6 space-y-6">
      {currentState === 'idle' && !selectedSentence && (
        <SentenceList
          sentences={sampleSentences}
          onSelect={handleSelectSentence}
          getBestScore={getBestScoreBySentence}
        />
      )}
      
      {currentState === 'idle' && selectedSentence && !evaluationResult && (
        <SentenceDetail
          sentence={selectedSentence}
          onPlay={handlePlay}
          onChangeSelection={() => setSelectedSentence(null)}
          attemptCount={0}
          bestScore={getBestScoreBySentence(selectedSentence.id)}
        />
      )}
      
      {currentState === 'playing' && selectedSentence && (
        <AudioPlayer sentence={selectedSentence} />
      )}
      
      {currentState === 'waiting' && (
        <CountdownOverlay count={countdown} />
      )}
      
      {currentState === 'beep' && (
        <BeepIndicator />
      )}
      
      {currentState === 'recording' && (
        <RecordingController
          duration={recordingDuration / 1000}
          audioLevel={audioLevel}
          onStop={handleStopRecording}
        />
      )}
      
      {currentState === 'analyzing' && (
        <AnalyzingIndicator
          progress={analyzingProgress}
          message={analyzingMessage}
        />
      )}
      
      {currentState === 'result' && evaluationResult && selectedSentence && (
        <ScoreCard
          attempt={evaluationResult}
          originalSentence={selectedSentence}
          onTryAgain={handleTryAgain}
          onNextSentence={handleNextSentence}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {manualInputMode && selectedSentence && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              음성이 인식되지 않았습니다
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              직접 입력하시거나 다시 녹음해주세요
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your spoken text:
            </label>
            <textarea
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Enter what you said..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleManualSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              제출
            </button>
            <button
              onClick={handleManualCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              다시 녹음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
