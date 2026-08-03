import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { badRequest, isRecordNotFound, isValidObjectId, notFound, revalidateContent, serverError } from '@/lib/api';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const specializationSchema = yup.object({
  icon: yup.string().trim().max(100).default(''),
  label: yup.string().trim().max(200).required('Label is required'),
  description: yup.string().trim().max(2000).required('Description is required'),
  details: yup
    .array()
    .of(yup.string().trim().max(5000).required())
    .min(1, 'At least one detail paragraph is required')
    .required('Details are required'),
});

export async function GET(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');

    if (pageParam !== null) {
      const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '5', 10) || 5));

      const [specializations, total] = await Promise.all([
        prisma.specialization.findMany({
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.specialization.count({ where: { isActive: true } }),
      ]);

      return NextResponse.json(
        {
          specializations,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
      );
    }

    const specializations = await prisma.specialization.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { specializations },
      { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
    );
  } catch (err) {
    return serverError('Failed to fetch specializations:', err);
  }
}

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const data = await specializationSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const specialization = await prisma.specialization.create({ data });
    revalidateContent('/');
    return NextResponse.json(specialization);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Failed to create specialization:', err);
  }
}

export async function PUT(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!isValidObjectId(body?.id)) return badRequest('A valid ID is required');

    // stripUnknown keeps the client away from isActive / createdAt / id.
    const data = await specializationSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const specialization = await prisma.specialization.update({ where: { id: body.id }, data });
    revalidateContent('/');
    return NextResponse.json(specialization);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    if (isRecordNotFound(err)) return notFound('Specialization not found');
    return serverError('Failed to update specialization:', err);
  }
}

export async function DELETE(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await request.json();

    if (!isValidObjectId(id)) return badRequest('A valid ID is required');

    await prisma.specialization.update({ where: { id }, data: { isActive: false } });
    revalidateContent('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isRecordNotFound(err)) return notFound('Specialization not found');
    return serverError('Failed to delete specialization:', err);
  }
}
