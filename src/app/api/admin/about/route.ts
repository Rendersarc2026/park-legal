import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { badRequest, revalidateContent, serverError } from '@/lib/api';
import { DEFAULT_ABOUT } from '@/lib/content';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const aboutSchema = yup.object({
  description: yup.string().trim().max(5000).required('Description is required'),
  stats: yup
    .array()
    .of(
      yup.object({
        label: yup.string().trim().max(100).required('Stat label is required'),
        value: yup.string().trim().max(50).required('Stat value is required'),
      })
    )
    .max(12)
    .required('Stats are required'),
  points: yup
    .array()
    .of(yup.string().trim().max(300).required())
    .max(12)
    .required('Points are required'),
});

export async function GET() {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const about = await prisma.aboutSection.findFirst({ where: { isActive: true } });
    return NextResponse.json(about ?? DEFAULT_ABOUT);
  } catch (err) {
    return serverError('Failed to fetch about section:', err);
  }
}

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const data = await aboutSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const existing = await prisma.aboutSection.findFirst();

    const saved = existing
      ? await prisma.aboutSection.update({ where: { id: existing.id }, data })
      : await prisma.aboutSection.create({ data });

    revalidateContent('/about');
    return NextResponse.json(saved);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Failed to update about section:', err);
  }
}
