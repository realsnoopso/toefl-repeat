'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface AnalyzingIndicatorProps {
  progress: number;
  message: string;
}

export function AnalyzingIndicator({ progress, message }: AnalyzingIndicatorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6 text-center">
        <div className="flex justify-center">
          <motion.div 
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <h3 className="text-xl font-semibold">
          Analyzing your speech...
        </h3>

        <div className="space-y-2">
          <Progress value={progress} />
          <span className="text-sm text-muted-foreground">
            {progress}%
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
