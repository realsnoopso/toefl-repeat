'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">🎙️ TOEFL Repeat</h1>
          <p className="text-sm text-muted-foreground">이메일로 로그인</p>
        </div>

        {sent ? (
          <div className="text-center space-y-3">
            <span className="text-4xl">📧</span>
            <p className="text-sm">
              <strong>{email}</strong>로 로그인 링크를 보냈어요.
            </p>
            <p className="text-xs text-muted-foreground">
              이메일을 확인하고 링크를 클릭하세요.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSent(false); setEmail(''); }}
            >
              다른 이메일로 시도
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '전송 중...' : '로그인 링크 받기'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
