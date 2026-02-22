'use client';

import { Sentence } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getDifficultyVariant } from '@/lib/utils/helpers';

interface SentenceDetailProps {
  sentence: Sentence;
  onPlay: () => void;
  onChangeSelection: () => void;
  attemptCount: number;
  bestScore: number | null;
}

export function SentenceDetail({ sentence, onPlay, onChangeSelection, attemptCount, bestScore }: SentenceDetailProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Badge variant={getDifficultyVariant(sentence.difficulty)}>
          {sentence.difficulty}
        </Badge>
        
        <div className="my-6 p-6 bg-muted/30 rounded-lg">
          <p className="text-lg leading-relaxed">
            {sentence.text}
          </p>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{sentence.wordCount} words</span>
          {bestScore !== null && (
            <span>Best: ★ {bestScore.toFixed(1)}</span>
          )}
        </div>

        <Button 
          size="lg" 
          className="w-full mt-6 h-14 text-lg"
          onClick={onPlay}
        >
          ▶ Play Audio
        </Button>

        <Button 
          variant="ghost" 
          className="w-full mt-2"
          onClick={onChangeSelection}
        >
          Change Sentence
        </Button>
      </CardContent>
    </Card>
  );
}
