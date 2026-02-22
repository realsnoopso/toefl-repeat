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
    <div className="space-y-4">
      {/* Accuracy bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <span className={`text-sm font-bold tabular-nums ${
          accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-red-600'
        }`}>
          {accuracy}%
        </span>
      </div>

      {/* Original sentence */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">원문</p>
        <p className="text-sm leading-relaxed text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
          {original}
        </p>
      </div>

      {/* Diff result */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">내 발음</p>
        <div className="text-[15px] leading-[1.8] bg-background border border-border rounded-lg px-3 py-2.5">
          {tokens.map((token, i) => {
            switch (token.type) {
              case 'correct':
                return (
                  <span key={i} className="text-foreground">
                    {token.original}{' '}
                  </span>
                );
              case 'wrong':
                return (
                  <span key={i} className="inline-block mx-0.5 relative">
                    <span className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded px-1 py-0.5">
                      <span className="line-through text-red-500 decoration-2">
                        {token.spoken}
                      </span>
                      <span className="text-emerald-600 font-semibold ml-1">
                        {token.original}
                      </span>
                    </span>{' '}
                  </span>
                );
              case 'missing':
                return (
                  <span key={i} className="inline-block mx-0.5">
                    <span className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 border-dashed rounded px-1 py-0.5 text-amber-700 dark:text-amber-400 font-medium">
                      {token.original}
                    </span>{' '}
                  </span>
                );
              case 'extra':
                return (
                  <span key={i} className="inline-block mx-0.5">
                    <span className="text-red-400 line-through decoration-1 text-xs opacity-50">
                      {token.spoken}
                    </span>{' '}
                  </span>
                );
            }
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block" />
          <span className="text-muted-foreground"><span className="line-through text-red-500">틀린</span> → 정답</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 border-dashed inline-block" />
          <span className="text-muted-foreground">빠진 단어</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-foreground inline-block" />
          <span className="text-muted-foreground">정확</span>
        </span>
      </div>
    </div>
  );
}
