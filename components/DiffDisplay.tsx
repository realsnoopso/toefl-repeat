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
      {/* Diff visualization */}
      <div className="text-sm leading-relaxed flex flex-wrap gap-x-1 gap-y-0.5">
        {tokens.map((token, i) => {
          switch (token.type) {
            case 'correct':
              return (
                <span key={i} className="text-foreground">
                  {token.original}
                </span>
              );
            case 'wrong':
              return (
                <span key={i} className="inline-flex items-baseline gap-0.5">
                  <span className="line-through text-red-500 opacity-60 text-xs">
                    {token.spoken}
                  </span>
                  <span className="text-emerald-600 font-medium">
                    {token.original}
                  </span>
                </span>
              );
            case 'missing':
              return (
                <span key={i} className="text-amber-600 font-medium">
                  ({token.original})
                </span>
              );
            case 'extra':
              return (
                <span key={i} className="text-red-400 text-xs opacity-60">
                  [{token.spoken}]
                </span>
              );
          }
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="line-through text-red-500">틀린 단어</span>
          <span className="text-emerald-600">정답</span>
        </span>
        <span className="text-amber-600">(빠진 단어)</span>
        <span className="text-red-400 opacity-60">[추가 단어]</span>
        <span className="ml-auto font-medium">{accuracy}% 정확도</span>
      </div>
    </div>
  );
}
