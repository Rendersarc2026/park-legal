import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Limit size to 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size too large. Maximum limit is 5MB.' }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to MongoDB
    const uploadedImage = await prisma.uploadedImage.create({
      data: {
        name: file.name,
        type: file.type,
        data: buffer,
      },
    });

    // We will serve images via a dynamic route /api/images/[id]
    const imageUrl = `/api/images/${uploadedImage.id}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload to database' }, { status: 500 });
  }
}
