import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { serverError } from '@/lib/api';
import { MAX_IMAGE_BYTES, sanitizeFileName, sniffImageType } from '@/lib/images';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'File size too large. Maximum limit is 5MB.' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // The declared MIME type is attacker-controlled, so the stored type comes
    // from the file's own magic bytes instead.
    const type = sniffImageType(buffer);

    if (!type) {
      return NextResponse.json(
        { error: 'Unsupported file. Upload a JPEG, PNG, WebP, GIF or AVIF image.' },
        { status: 415 }
      );
    }

    const uploadedImage = await prisma.uploadedImage.create({
      data: {
        name: sanitizeFileName(file.name),
        type,
        data: buffer,
      },
      select: { id: true },
    });

    return NextResponse.json({ imageUrl: `/api/images/${uploadedImage.id}` });
  } catch (err) {
    return serverError('Upload error:', err);
  }
}
