'use client';

import { UserStatistics } from '@/lib/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { renderStars, formatDuration } from '@/lib/utils/helpers';

interface StatisticsCardProps {
  statistics: UserStatistics;
}

export function StatisticsCard({ statistics }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">📊 Your Statistics</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatItem 
            label="Total Attempts" 
            value={statistics.totalAttempts.toString()}
          />
          <StatItem 
            label="Average Score" 
            value={`${statistics.averageScore.toFixed(1)} ${renderStars(statistics.averageScore)}`}
          />
          <StatItem 
            label="Best Score" 
            value={`${statistics.bestScore.toFixed(1)} ${renderStars(statistics.bestScore)}`}
          />
          <StatItem 
            label="Practice Time" 
            value={formatDuration(statistics.totalPracticeTime)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
