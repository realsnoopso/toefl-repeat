import { Sentence } from '../types';

// 샘플 문장 데이터 (TOEFL 스타일)
export const sampleSentences: Sentence[] = [
  {
    id: '1',
    text: 'The cat sat on the mat.',
    difficulty: 'easy',
    wordCount: 6,
    contentWords: ['cat', 'sat', 'mat']
  },
  {
    id: '2',
    text: 'Students should complete their assignments before the deadline.',
    difficulty: 'easy',
    wordCount: 8,
    contentWords: ['students', 'complete', 'assignments', 'deadline']
  },
  {
    id: '3',
    text: 'Climate change affects global weather patterns and requires immediate action.',
    difficulty: 'medium',
    wordCount: 10,
    contentWords: ['climate', 'change', 'affects', 'global', 'weather', 'patterns', 'requires', 'immediate', 'action']
  },
  {
    id: '4',
    text: 'The university library provides students with access to extensive academic resources.',
    difficulty: 'medium',
    wordCount: 12,
    contentWords: ['university', 'library', 'provides', 'students', 'access', 'extensive', 'academic', 'resources']
  },
  {
    id: '5',
    text: 'Renewable energy sources such as solar and wind power have become increasingly cost-effective.',
    difficulty: 'medium',
    wordCount: 14,
    contentWords: ['renewable', 'energy', 'sources', 'solar', 'wind', 'power', 'increasingly', 'cost-effective']
  },
  {
    id: '6',
    text: 'The implementation of sustainable agricultural practices can significantly reduce environmental degradation while maintaining crop yields.',
    difficulty: 'hard',
    wordCount: 16,
    contentWords: ['implementation', 'sustainable', 'agricultural', 'practices', 'significantly', 'reduce', 'environmental', 'degradation', 'maintaining', 'crop', 'yields']
  },
  {
    id: '7',
    text: 'Interdisciplinary collaboration among researchers from diverse fields has led to groundbreaking innovations in biotechnology.',
    difficulty: 'hard',
    wordCount: 15,
    contentWords: ['interdisciplinary', 'collaboration', 'researchers', 'diverse', 'fields', 'groundbreaking', 'innovations', 'biotechnology']
  },
  {
    id: '8',
    text: 'The professor discussed the fundamental principles of quantum mechanics during the advanced physics seminar.',
    difficulty: 'hard',
    wordCount: 15,
    contentWords: ['professor', 'discussed', 'fundamental', 'principles', 'quantum', 'mechanics', 'advanced', 'physics', 'seminar']
  }
];

// 난이도별 필터링 함수
export function getSentencesByDifficulty(difficulty?: 'easy' | 'medium' | 'hard'): Sentence[] {
  if (!difficulty) return sampleSentences;
  return sampleSentences.filter(s => s.difficulty === difficulty);
}

// ID로 문장 찾기
export function getSentenceById(id: string): Sentence | undefined {
  return sampleSentences.find(s => s.id === id);
}
