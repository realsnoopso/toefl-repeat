'use client';

import { Sentence } from '@/lib/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDifficultyVariant } from '@/lib/utils/helpers';

interface SentenceListProps {
  sentences: Sentence[];
  onSelect: (sentence: Sentence) => void;
  getBestScore: (id: string) => number | null;
}

export function SentenceList({ sentences, onSelect, getBestScore }: SentenceListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Select a sentence to practice</h2>
      
      <ScrollArea className="h-[60vh]">
        <div className="space-y-3">
          {sentences.map(sentence => {
            const bestScore = getBestScore(sentence.id);
            
            return (
              <Card
                key={sentence.id}
                className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => onSelect(sentence)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyVariant(sentence.difficulty)}>
                      {sentence.difficulty}
                    </Badge>
                    {bestScore !== null && (
                      <span className="text-sm text-muted-foreground">
                        Best: ★ {bestScore.toFixed(1)}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{sentence.text}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {sentence.wordCount} words
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
