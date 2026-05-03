import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(testimonials);
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        quote: data.quote,
        stars: parseInt(data.stars, 10),
        author: data.author || '',
      },
    });
    return NextResponse.json(testimonial);
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Create Error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (updateData.stars) {
      updateData.stars = parseInt(updateData.stars, 10);
    }
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(testimonial);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Update Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update testimonial', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Delete Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete testimonial', details: error.message }, { status: 500 });
  }
}
