import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attempts, recordings, stats } = body;

    if (!attempts || !Array.isArray(attempts)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    // Upload recordings as separate blob files
    const audioUrls: Record<string, string> = {};
    if (recordings && typeof recordings === 'object') {
      const entries = Object.entries(recordings as Record<string, string>);
      for (const [attemptId, dataUrl] of entries) {
        try {
          // Parse data URL: data:audio/webm;base64,xxxxx
          const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (!match) continue;
          const [, mimeType, base64] = match;
          const buffer = Buffer.from(base64, 'base64');
          const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'mp4' : 'wav';
          
          const blob = await put(`shared/${id}/audio/${attemptId}.${ext}`, buffer, {
            access: 'public',
            contentType: mimeType,
          });
          audioUrls[attemptId] = blob.url;
        } catch {
          // Skip failed uploads
        }
      }
    }

    // Upload metadata
    const data = JSON.stringify({
      id,
      createdAt: new Date().toISOString(),
      stats,
      attempts,
      audioUrls,
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
