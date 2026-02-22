'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownOverlayProps {
  count: number;
}

export function CountdownOverlay({ count }: CountdownOverlayProps) {
  return (
    <Card className="border-primary/50">
      <CardContent className="pt-6 text-center">
        <div className="mb-4">
          <span className="text-4xl">🎯</span>
        </div>

        <h3 className="text-2xl font-semibold mb-6">
          Get Ready!
        </h3>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin" 
               style={{ animationDuration: '1s' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              key={count}
              className="text-6xl font-bold text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {count}
            </motion.span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Prepare to speak after the beep...
        </p>
      </CardContent>
    </Card>
  );
}
