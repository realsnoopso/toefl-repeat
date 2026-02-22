import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const shareId = formData.get('shareId') as string;
    const attemptId = formData.get('attemptId') as string;
    const file = formData.get('file') as File;

    if (!shareId || !attemptId || !file) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.includes('webm') ? 'webm' : file.type.includes('mp4') ? 'mp4' : 'wav';

    const blob = await put(`shared/${shareId}/audio/${attemptId}.${ext}`, buffer, {
      access: 'public',
      contentType: file.type || 'audio/webm',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
