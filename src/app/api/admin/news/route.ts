import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { badRequest, isRecordNotFound, isValidObjectId, notFound, revalidateContent, serverError } from '@/lib/api';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const articleSchema = yup.object({
  title: yup.string().trim().max(300).required('Title is required'),
  excerpt: yup.string().trim().max(1000).required('Excerpt is required'),
  content: yup.string().trim().max(50000).default(''),
  date: yup
    .string()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('Date is required'),
  category: yup.string().trim().max(100).required('Category is required'),
  imageUrl: yup
    .string()
    .trim()
    .max(2000)
    .matches(/^(\/|https:\/\/)/, 'Image URL must be a relative path or an https URL')
    .required('Image is required'),
});

export async function GET(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '5', 10) || 5));

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { isActive: true },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json(
      {
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      {
        headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
      }
    );
  } catch (err) {
    return serverError('Failed to fetch articles:', err);
  }
}

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    // stripUnknown keeps the client away from isActive / createdAt / id.
    const data = await articleSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const article = await prisma.article.create({ data });
    revalidateContent('/', '/admin');
    return NextResponse.json(article);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Failed to create article:', err);
  }
}

export async function PUT(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!isValidObjectId(body?.id)) return badRequest('A valid ID is required');

    const data = await articleSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const article = await prisma.article.update({ where: { id: body.id }, data });
    revalidateContent('/', '/admin');
    return NextResponse.json(article);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    if (isRecordNotFound(err)) return notFound('Article not found');
    return serverError('Failed to update article:', err);
  }
}

export async function DELETE(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await request.json();

    if (!isValidObjectId(id)) return badRequest('A valid ID is required');

    await prisma.article.update({ where: { id }, data: { isActive: false } });
    revalidateContent('/', '/admin');
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isRecordNotFound(err)) return notFound('Article not found');
    return serverError('Failed to delete article:', err);
  }
}
