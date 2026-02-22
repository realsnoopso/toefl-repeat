'use client';

import { TabId } from '@/lib/types';
import { motion } from 'framer-motion';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'practice', label: '연습', icon: '🎧' },
  { id: 'history', label: '기록', icon: '📊' },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="flex border-t border-border bg-background safe-bottom">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
        >
          {active === t.id && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-foreground rounded-full"
            />
          )}
          <span className="text-lg">{t.icon}</span>
          <span className={`text-xs ${active === t.id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {t.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
