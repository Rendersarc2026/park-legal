import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const about = await prisma.aboutSection.findFirst();
    if (!about) {
      return NextResponse.json({
        description: 'We combine deep legal expertise with a practical understanding of the real-world challenges our clients face.',
        stats: [
          { label: "Years Experience", value: "15+" },
          { label: "Cases Won", value: "100+" },
          { label: "Client Dedication", value: "100%" },
          { label: "Legal Support", value: "24/7" }
        ],
        points: [
          "Decades of experience",
          "Specialized expertise",
          "Proven track record",
          "Transparent fee structure"
        ]
      });
    }
    return NextResponse.json(about);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const existing = await prisma.aboutSection.findFirst();
    
    if (existing) {
      const updated = await prisma.aboutSection.update({
        where: { id: existing.id },
        data: {
          description: data.description,
          stats: data.stats,
          points: data.points,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.aboutSection.create({
        data: {
          description: data.description,
          stats: data.stats,
          points: data.points,
        },
      });
      return NextResponse.json(created);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}
