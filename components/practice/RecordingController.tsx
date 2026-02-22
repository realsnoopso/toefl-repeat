'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RecordingControllerProps {
  duration: number;
  audioLevel: number;
  onStop: () => void;
}

export function RecordingController({ duration, audioLevel, onStop }: RecordingControllerProps) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-center gap-2">
          <motion.div 
            className="w-3 h-3 bg-destructive rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-lg font-semibold">Recording...</span>
        </div>

        {/* Simple audio waveform */}
        <div className="flex items-center justify-center gap-1 h-24">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-destructive rounded-full"
              animate={{
                height: `${10 + Math.random() * 70}%`,
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatType: 'mirror'
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <span className="text-2xl font-mono font-bold">
            {duration.toFixed(1)}s
          </span>
        </div>

        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full h-16 text-lg"
          onClick={onStop}
        >
          ⏹ Stop Recording
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Speak clearly and naturally
        </p>
      </CardContent>
    </Card>
  );
}
