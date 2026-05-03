import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(articles);
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
      data: updateData,
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

    await prisma.article.delete({ where: { id } });
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
