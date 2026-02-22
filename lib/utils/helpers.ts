// 별점 렌더링
export function renderStars(score: number): string {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '⭐'.repeat(fullStars) + 
         (hasHalfStar ? '⭐' : '') + 
         '☆'.repeat(emptyStars);
}

// 점수에 따른 이모지
export function getScoreEmoji(score: number): string {
  if (score >= 4.5) return '🎉';
  if (score >= 3.5) return '😊';
  if (score >= 2.5) return '🙂';
  if (score >= 1.5) return '😐';
  return '😔';
}

// 난이도 배지 variant
export function getDifficultyVariant(difficulty: 'easy' | 'medium' | 'hard'): 'default' | 'secondary' | 'destructive' {
  const variants = {
    easy: 'default' as const,
    medium: 'secondary' as const,
    hard: 'destructive' as const
  };
  return variants[difficulty];
}

// 날짜 포맷
export function formatDate(date: Date, format: 'long' | 'short' = 'long'): string {
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// 시간 포맷 (초 → "3h 24min")
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

// 점수 배지 variant
export function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 4.0) return 'default';
  if (score >= 2.5) return 'secondary';
  return 'destructive';
}
