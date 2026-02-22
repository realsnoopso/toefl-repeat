'use client';

import { Sentence } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface AudioPlayerProps {
  sentence: Sentence;
}

export function AudioPlayer({ sentence }: AudioPlayerProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-2xl">🔊</span>
          <span className="text-sm font-medium">Playing Audio...</span>
        </div>

        <div className="p-6 bg-muted/30 rounded-lg">
          <p className="text-lg leading-relaxed">
            {sentence.text}
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Listen carefully!
        </p>
      </CardContent>
    </Card>
  );
}
