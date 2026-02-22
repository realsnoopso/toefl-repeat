import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the blob
    const { blobs } = await list({ prefix: `shared/${id}.json` });
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Fetch the content
    const response = await fetch(blobs[0].url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch share error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
