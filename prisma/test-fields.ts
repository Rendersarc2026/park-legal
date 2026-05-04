import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Testimonial fields...');
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true }
    });
    console.log('Successfully queried with isActive: true. Count:', testimonials.length);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
