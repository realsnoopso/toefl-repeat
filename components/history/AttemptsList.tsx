'use client';

import { PracticeAttempt } from '@/lib/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderStars, formatDate, getScoreBadgeVariant } from '@/lib/utils/helpers';

interface AttemptsListProps {
  attempts: PracticeAttempt[];
}

export function AttemptsList({ attempts }: AttemptsListProps) {
  // Sort by timestamp descending (most recent first)
  const sortedAttempts = [...attempts].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <ScrollArea className="h-[50vh] mt-4">
      <div className="space-y-3">
        {sortedAttempts.map(attempt => (
          <Card key={attempt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(attempt.timestamp)}
                  </p>
                  <p className="text-sm font-medium line-clamp-2">
                    {attempt.sentenceText}
                  </p>
                </div>
                <Badge variant={getScoreBadgeVariant(attempt.scores.total)} className="ml-2">
                  {attempt.scores.total.toFixed(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {renderStars(attempt.scores.total)}
                </span>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>F: {attempt.scores.fluency.toFixed(1)}</span>
                  <span>I: {attempt.scores.intelligibility.toFixed(1)}</span>
                  <span>A: {attempt.scores.accuracy.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
