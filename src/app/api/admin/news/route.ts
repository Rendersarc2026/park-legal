import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(articles);
  } catch (err: any) {
    console.error('Prisma Error:', err);
    return NextResponse.json({ error: 'Failed to fetch articles', details: err.message }, { status: 500 });
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
  } catch (err: any) {
    console.error('Prisma Create Error:', err);
    return NextResponse.json({ error: 'Failed to create article', details: err.message }, { status: 500 });
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
  } catch (err: any) {
    console.error('Prisma Update Error:', err);
    
    // Handle record not found error (P2025)
    if (err.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Article not found', 
        details: 'The article you are trying to update no longer exists.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to update article', details: err.message }, { status: 500 });
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
  } catch (err: any) {
    console.error('Prisma Delete Error:', err);
    
    if (err.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Article not found', 
        details: 'The article you are trying to delete no longer exists.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete article', details: err.message }, { status: 500 });
  }
}
