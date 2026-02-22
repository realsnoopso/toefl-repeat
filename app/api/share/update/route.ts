import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { shareId, audioUrls, attempts, stats } = await request.json();
    if (!shareId) {
      return NextResponse.json({ error: 'Missing shareId' }, { status: 400 });
    }

    // Fetch existing shared data
    const blobs = await list({ prefix: `shared/${shareId}.json` });
    const existing = blobs.blobs[0];
    if (!existing) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    const res = await fetch(existing.url);
    const data = await res.json();

    // Merge updates
    if (audioUrls) {
      data.audioUrls = { ...(data.audioUrls || {}), ...audioUrls };
    }
    if (attempts) {
      data.attempts = attempts;
    }
    if (stats) {
      data.stats = stats;
    }

    // Re-upload
    await put(`shared/${shareId}.json`, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
