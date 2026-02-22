import { NextResponse } from 'next/server';

// Generate a client upload token for direct browser → Blob uploads
export async function POST() {
  // Return the blob token for client-side uploads
  // In production you'd want auth here, but for now it's open
  return NextResponse.json({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
