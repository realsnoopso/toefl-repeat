import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attempts, stats } = body;

    if (!attempts || !Array.isArray(attempts)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const data = JSON.stringify({
      id,
      createdAt: new Date().toISOString(),
      stats,
      attempts,
      audioUrls: {},
    });

    await put(`shared/${id}.json`, data, {
      access: 'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}
