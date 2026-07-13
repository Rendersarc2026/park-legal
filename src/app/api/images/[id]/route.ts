import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidObjectId } from '@/lib/api';
import { isAllowedImageType } from '@/lib/images';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // A non-ObjectId string makes Prisma throw rather than return null.
    if (!isValidObjectId(id)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const image = await prisma.uploadedImage.findFirst({
      where: { id, isActive: true },
      select: { type: true, data: true },
    });

    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Rows predating the upload allowlist could hold any declared type, so the
    // check is repeated on the way out. Serving text/html from our own origin
    // would be a same-origin XSS.
    if (!isAllowedImageType(image.type)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(image.data), {
      headers: {
        'Content-Type': image.type,
        'Content-Length': String(image.data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
