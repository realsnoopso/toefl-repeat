'use client';

import { PracticeAttempt, Sentence } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { renderStars, getScoreEmoji } from '@/lib/utils/helpers';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  attempt: PracticeAttempt;
  originalSentence: Sentence;
  onTryAgain: () => void;
  onNextSentence: () => void;
  onViewHistory: () => void;
}

export function ScoreCard({ attempt, originalSentence, onTryAgain, onNextSentence, onViewHistory }: ScoreCardProps) {
  const { scores, feedback, userTranscript } = attempt;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="w-full">
        <CardContent className="pt-6 space-y-6">
          {/* Emoji */}
          <div className="text-center">
            <span className="text-5xl">{getScoreEmoji(scores.total)}</span>
          </div>

          {/* Total Score */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <motion.div 
              className="text-6xl font-bold text-primary"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
            >
              {scores.total.toFixed(1)}
            </motion.div>
            <div className="text-2xl">
              {renderStars(scores.total)}
            </div>
          </div>

          <Separator />

          {/* Detailed Scores */}
          <div className="space-y-3">
            <ScoreDimension label="Fluency" score={scores.fluency} color="blue" />
            <ScoreDimension label="Intelligibility" score={scores.intelligibility} color="green" />
            <ScoreDimension label="Accuracy" score={scores.accuracy} color="purple" />
          </div>

          <Separator />

          {/* Feedback */}
          <div className="space-y-3">
            <h4 className="font-semibold">💬 Feedback</h4>
            <p className="text-sm">{feedback.overall}</p>
            
            {feedback.actionItems.length > 0 && (
              <ul className="text-sm text-muted-foreground space-y-1">
                {feedback.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          {/* Transcript Comparison */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Transcript Comparison</h4>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">You said:</p>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm">{userTranscript || '(No transcript available)'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Original:</p>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm">{originalSentence.text}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              size="lg" 
              className="w-full"
              onClick={onTryAgain}
            >
              Try Again
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full"
              onClick={onNextSentence}
            >
              Next Sentence
            </Button>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={onViewHistory}
            >
              View History
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScoreDimension({ label, score, color }: { label: string; score: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">{renderStars(score)}</span>
          <span className="text-sm font-semibold min-w-[2rem]">
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <Progress value={(score / 5) * 100} className={`h-2 [&>div]:${colorClasses[color as keyof typeof colorClasses]}`} />
    </div>
  );
}
