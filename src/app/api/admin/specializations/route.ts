import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }, // usually order is important for these, asc means older first
    });

    return NextResponse.json({ specializations });
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch specializations', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const specialization = await prisma.specialization.create({
      data: {
        icon: data.icon,
        label: data.label,
        description: data.description,
        details: data.details, // Should be string[]
      },
    });
    revalidatePath('/');
    return NextResponse.json(specialization);
  } catch (err) {
    const error = err as Error;
    console.error('Prisma Create Error:', error);
    return NextResponse.json({ error: 'Failed to create specialization', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const specialization = await prisma.specialization.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/');
    return NextResponse.json(specialization);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Update Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Specialization not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update specialization', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Soft delete
    await prisma.specialization.update({ 
      where: { id },
      data: { isActive: false }
    });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as { code?: string; message?: string };
    console.error('Prisma Delete Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Specialization not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete specialization', details: error.message }, { status: 500 });
  }
}
