import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const image = await prisma.uploadedImage.findUnique({
      where: { id },
    });

    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Return the binary data with the correct content-type header
    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
