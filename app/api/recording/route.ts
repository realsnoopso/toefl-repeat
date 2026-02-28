import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const attemptId = formData.get('attemptId') as string;

    if (!file || !attemptId) {
      return NextResponse.json({ error: 'Missing fields', detail: { hasFile: !!file, hasAttemptId: !!attemptId } }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file', size: 0 }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.includes('webm') ? 'webm' : file.type.includes('mp4') ? 'mp4' : 'wav';

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not set');
      return NextResponse.json({ error: 'Server config error: no blob token' }, { status: 500 });
    }

    const blob = await put(`recordings/${attemptId}.${ext}`, buffer, {
      access: 'public',
      contentType: file.type || 'audio/webm',
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Recording upload error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Upload failed', detail: message }, { status: 500 });
  }
}
