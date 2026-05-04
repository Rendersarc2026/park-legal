import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { isActive: true },
        orderBy: [
          { date: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.article.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const article = await prisma.article.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        date: data.date,
        category: data.category,
        imageUrl: data.imageUrl,
      },
    });
    return NextResponse.json(article);
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Create Error:', error);
    return NextResponse.json({ error: 'Failed to create article', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: updateData.title,
        excerpt: updateData.excerpt,
        content: updateData.content,
        date: updateData.date,
        category: updateData.category,
        imageUrl: updateData.imageUrl,
      },
    });
    return NextResponse.json(article);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Update Error:', error);
    
    // Handle record not found error (P2025)
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Article not found', 
        details: 'The article you are trying to update no longer exists.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to update article', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.article.update({ 
      where: { id },
      data: { isActive: false }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Delete Error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Article not found', 
        details: 'The article you are trying to delete no longer exists.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
  }
}
