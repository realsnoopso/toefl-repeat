// 문장 데이터 타입
export interface Sentence {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  contentWords: string[];
}

// 연습 시도 타입
export interface PracticeAttempt {
  id: string;
  sentenceId: string;
  sentenceText: string;
  timestamp: Date;
  
  // 녹음 데이터
  recordingDuration: number;
  
  // 전사 결과
  userTranscript: string;
  
  // 타이밍 메트릭
  responseLatency: number;
  
  // 평가 결과
  scores: {
    fluency: number;
    intelligibility: number;
    accuracy: number;
    total: number;
  };
  
  // 상세 메트릭
  metrics: {
    pauseCount: number;
    contentWordMatches: number;
    contentWordTotal: number;
    wordOrderAccuracy: number;
  };
  
  // 피드백
  feedback: {
    overall: string;
    actionItems: string[];
  };
}

// 사용자 통계
export interface UserStatistics {
  totalAttempts: number;
  totalPracticeTime: number;
  averageScore: number;
  averageFluency: number;
  averageIntelligibility: number;
  averageAccuracy: number;
  bestScore: number;
  bestAttemptId: string;
  firstAttemptDate: Date;
  lastAttemptDate: Date;
}

// 연습 상태
export type PracticeState = 
  | 'idle' 
  | 'playing' 
  | 'waiting' 
  | 'beep' 
  | 'recording' 
  | 'analyzing' 
  | 'result';
