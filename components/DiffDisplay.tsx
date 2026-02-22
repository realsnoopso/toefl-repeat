'use client';

import { diffSentences } from '@/lib/evaluation/diff';

interface DiffDisplayProps {
  original: string;
  spoken: string;
}

export function DiffDisplay({ original, spoken }: DiffDisplayProps) {
  if (!original || !spoken) return null;

  const tokens = diffSentences(original, spoken);
  const correct = tokens.filter(t => t.type === 'correct').length;
  const total = tokens.filter(t => t.type !== 'extra').length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="text-[15px] leading-[1.9]">
        {tokens.map((token, i) => {
          switch (token.type) {
            case 'correct':
              return <span key={i} className="text-emerald-600 dark:text-emerald-400">{token.original} </span>;
            case 'wrong':
              return <span key={i} className="text-red-500 dark:text-red-400 line-through decoration-1">{token.original} </span>;
            case 'missing':
              return <span key={i} className="text-red-500 dark:text-red-400 line-through decoration-1">{token.original} </span>;
            case 'extra':
              return null; // 원문 기준으로만 표시
          }
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{correct}/{total}</span>
        <span className={`font-semibold ${
          accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-red-500'
        }`}>{accuracy}%</span>
      </div>
    </div>
  );
}
