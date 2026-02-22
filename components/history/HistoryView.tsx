'use client';

import { useEffect, useState } from 'react';
import { PracticeAttempt, UserStatistics } from '@/lib/types';
import { getAllAttempts, getStatistics } from '@/lib/storage/localStorage';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatisticsCard } from './StatisticsCard';
import { AttemptsList } from './AttemptsList';
import { TrendChart } from './TrendChart';

export function HistoryView() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedAttempts = getAllAttempts();
    const loadedStats = getStatistics();
    
    setAttempts(loadedAttempts);
    setStatistics(loadedStats);
  };

  const handleBackToPractice = () => {
    window.location.href = '/';
  };

  if (attempts.length === 0) {
    return (
      <div className="container max-w-[600px] mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-lg font-semibold">No practice history yet</h3>
            <p className="text-sm text-muted-foreground">
              Start practicing to see your progress here!
            </p>
            <Button onClick={handleBackToPractice}>
              Start Practicing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-[600px] mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Practice History</h1>
        <Button variant="ghost" onClick={handleBackToPractice}>
          ← Back to Practice
        </Button>
      </div>

      {statistics && <StatisticsCard statistics={statistics} />}

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">All Attempts</TabsTrigger>
          <TabsTrigger value="chart">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <AttemptsList attempts={attempts} />
        </TabsContent>

        <TabsContent value="chart">
          <TrendChart attempts={attempts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
