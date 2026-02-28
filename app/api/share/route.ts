import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: create a share
export async function POST(request: Request) {
  try {
    const { attemptIds } = await request.json();
    if (!attemptIds?.length) {
      return NextResponse.json({ error: 'No attempts' }, { status: 400 });
    }

    const id = Math.random().toString(36).slice(2, 10);
    const { error } = await supabase.from('shares').insert({ id, attempt_ids: attemptIds });
    if (error) {
      console.error('Share create error:', error);
      return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: fetch shared attempts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'No id' }, { status: 400 });

  const { data: share, error: shareError } = await supabase
    .from('shares').select('attempt_ids').eq('id', id).single();

  if (shareError || !share) {
    return NextResponse.json({ error: 'Share not found' }, { status: 404 });
  }

  const { data: attempts, error: attemptsError } = await supabase
    .from('attempts').select('*').in('id', share.attempt_ids).order('timestamp', { ascending: false });

  if (attemptsError) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }

  return NextResponse.json({ attempts: attempts || [] });
}
