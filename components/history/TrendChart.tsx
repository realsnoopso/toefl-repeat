'use client';

import { PracticeAttempt } from '@/lib/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils/helpers';

interface TrendChartProps {
  attempts: PracticeAttempt[];
}

export function TrendChart({ attempts }: TrendChartProps) {
  // Sort by timestamp and take last 20
  const sortedAttempts = [...attempts]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-20);

  const data = sortedAttempts.map((attempt, i) => ({
    index: i + 1,
    score: attempt.scores.total,
    date: formatDate(attempt.timestamp, 'short'),
  }));

  return (
    <Card className="mt-4">
      <CardHeader>
        <h4 className="font-semibold">📈 Score Trend (Last 20 Attempts)</h4>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="index" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--foreground))"
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--foreground))"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelFormatter={(value) => `Attempt ${value}`}
              formatter={(value) => [typeof value === 'number' ? value.toFixed(1) : '', 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
