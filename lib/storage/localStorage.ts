import { PracticeAttempt, UserStatistics } from '../types';

const ATTEMPTS_KEY = 'toefl-repeat-attempts';
const STATS_KEY = 'toefl-repeat-stats';
const MAX_ATTEMPTS = 500;

// localStorage 사용 가능 여부 확인
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// 연습 시도 저장
export function saveAttempt(attempt: PracticeAttempt): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const attempts = getAllAttempts();
    attempts.push(attempt);
    
    // 최대 개수 제한
    if (attempts.length > MAX_ATTEMPTS) {
      attempts.shift(); // 가장 오래된 것 제거
    }
    
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
    updateStatistics();
  } catch (error) {
    console.error('Failed to save attempt:', error);
  }
}

// 모든 연습 시도 가져오기
export function getAllAttempts(): PracticeAttempt[] {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) return [];
    
    const attempts = JSON.parse(data);
    // Date 객체로 변환
    return attempts.map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load attempts:', error);
    return [];
  }
}

// 특정 문장의 연습 시도 가져오기
export function getAttemptsBySentence(sentenceId: string): PracticeAttempt[] {
  return getAllAttempts().filter(a => a.sentenceId === sentenceId);
}

// 특정 문장의 최고 점수 가져오기
export function getBestScoreBySentence(sentenceId: string): number | null {
  const attempts = getAttemptsBySentence(sentenceId);
  if (attempts.length === 0) return null;
  
  return Math.max(...attempts.map(a => a.scores.total));
}

// 통계 업데이트
function updateStatistics(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const attempts = getAllAttempts();
    
    if (attempts.length === 0) {
      localStorage.removeItem(STATS_KEY);
      return;
    }
    
    const totalAttempts = attempts.length;
    const totalPracticeTime = attempts.reduce((sum, a) => sum + a.recordingDuration, 0) / 1000;
    
    const totalScore = attempts.reduce((sum, a) => sum + a.scores.total, 0);
    const totalFluency = attempts.reduce((sum, a) => sum + a.scores.fluency, 0);
    const totalIntelligibility = attempts.reduce((sum, a) => sum + a.scores.intelligibility, 0);
    const totalAccuracy = attempts.reduce((sum, a) => sum + a.scores.accuracy, 0);
    
    const averageScore = totalScore / totalAttempts;
    const averageFluency = totalFluency / totalAttempts;
    const averageIntelligibility = totalIntelligibility / totalAttempts;
    const averageAccuracy = totalAccuracy / totalAttempts;
    
    const bestAttempt = attempts.reduce((best, current) => 
      current.scores.total > best.scores.total ? current : best
    );
    
    const stats: UserStatistics = {
      totalAttempts,
      totalPracticeTime,
      averageScore,
      averageFluency,
      averageIntelligibility,
      averageAccuracy,
      bestScore: bestAttempt.scores.total,
      bestAttemptId: bestAttempt.id,
      firstAttemptDate: attempts[0].timestamp,
      lastAttemptDate: attempts[attempts.length - 1].timestamp
    };
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to update statistics:', error);
  }
}

// 통계 가져오기
export function getStatistics(): UserStatistics | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return null;
    
    const stats = JSON.parse(data);
    return {
      ...stats,
      firstAttemptDate: new Date(stats.firstAttemptDate),
      lastAttemptDate: new Date(stats.lastAttemptDate)
    };
  } catch (error) {
    console.error('Failed to load statistics:', error);
    return null;
  }
}

// 모든 데이터 삭제
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

// 데이터 내보내기 (JSON)
export function exportData(): string {
  const attempts = getAllAttempts();
  const stats = getStatistics();
  
  return JSON.stringify({
    attempts,
    stats,
    exportDate: new Date().toISOString()
  }, null, 2);
}
