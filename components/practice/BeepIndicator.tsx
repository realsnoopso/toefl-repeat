'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export function BeepIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <Card className="border-destructive border-4 bg-destructive/10 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
        <CardContent className="pt-6 text-center">
          <motion.div 
            className="mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3, repeat: 2 }}
          >
            <span className="text-6xl">🔔</span>
          </motion.div>

          <motion.h2 
            className="text-4xl font-bold text-destructive"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.2, repeat: 2 }}
          >
            Speak Now!
          </motion.h2>

          <p className="text-xl font-semibold text-destructive/80 mt-4">
            ♪ BEEP ♪
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
