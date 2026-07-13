import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { badRequest, isRecordNotFound, isValidObjectId, notFound, revalidateContent, serverError } from '@/lib/api';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const testimonialSchema = yup.object({
  quote: yup.string().trim().max(2000).required('Quote is required'),
  stars: yup
    .number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .integer('Stars must be a whole number')
    .min(1, 'Stars must be between 1 and 5')
    .max(5, 'Stars must be between 1 and 5')
    .default(5),
  author: yup.string().trim().max(200).default(''),
});

export async function GET(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '5', 10) || 5));

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testimonial.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      testimonials,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return serverError('Failed to fetch testimonials:', err);
  }
}

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const data = await testimonialSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const testimonial = await prisma.testimonial.create({ data });
    revalidateContent('/', '/admin');
    return NextResponse.json(testimonial);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Failed to create testimonial:', err);
  }
}

export async function PUT(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!isValidObjectId(body?.id)) return badRequest('A valid ID is required');

    // stripUnknown keeps the client away from isActive / createdAt / id.
    const data = await testimonialSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const testimonial = await prisma.testimonial.update({ where: { id: body.id }, data });
    revalidateContent('/', '/admin');
    return NextResponse.json(testimonial);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    if (isRecordNotFound(err)) return notFound('Testimonial not found');
    return serverError('Failed to update testimonial:', err);
  }
}

export async function DELETE(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await request.json();

    if (!isValidObjectId(id)) return badRequest('A valid ID is required');

    await prisma.testimonial.update({ where: { id }, data: { isActive: false } });
    revalidateContent('/', '/admin');
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isRecordNotFound(err)) return notFound('Testimonial not found');
    return serverError('Failed to delete testimonial:', err);
  }
}
