import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type AboutStat = { label: string; value: string };

export type AboutData = {
  description: string;
  stats: AboutStat[];
  points: string[];
};

export type DirectContact = { name: string; phone: string };

export type ContactData = {
  phone: string;
  email: string;
  address: string;
  directionsLink: string;
  directContacts: DirectContact[];
};

export type ArticleData = {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  date: string;
  category: string;
  imageUrl: string;
};

export type TestimonialData = {
  id: string;
  quote: string;
  stars: number;
  author: string | null;
};

export type SpecializationData = {
  id: string;
  label: string;
  description: string;
  details: string[];
};

export const DEFAULT_ABOUT: AboutData = {
  description:
    'We combine deep legal expertise with a practical understanding of the real-world challenges our clients face.',
  stats: [
    { label: 'Years Experience', value: '15+' },
    { label: 'Cases Won', value: '100+' },
    { label: 'Client Dedication', value: '100%' },
    { label: 'Legal Support', value: '24/7' },
  ],
  points: [
    'Decades of experience',
    'Specialized expertise',
    'Proven track record',
    'Transparent fee structure',
  ],
};

/**
 * Server-side readers for public page content. Each is wrapped in React's cache
 * so a page and its Footer share a single query per request.
 */

export const getAbout = cache(async (): Promise<AboutData> => {
  try {
    const about = await prisma.aboutSection.findFirst({ where: { isActive: true } });

    if (!about) return DEFAULT_ABOUT;

    return {
      description: about.description || DEFAULT_ABOUT.description,
      stats: (about.stats as unknown as AboutStat[]) ?? DEFAULT_ABOUT.stats,
      points: about.points?.length ? about.points : DEFAULT_ABOUT.points,
    };
  } catch (err) {
    console.error('Failed to load about section:', err);
    return DEFAULT_ABOUT;
  }
});

export const getContact = cache(async (): Promise<ContactData | null> => {
  try {
    const contact = await prisma.contactDetails.findFirst({ where: { isActive: true } });

    if (!contact) return null;

    return {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      directionsLink: contact.directionsLink,
      directContacts: (contact.directContacts as unknown as DirectContact[]) ?? [],
    };
  } catch (err) {
    console.error('Failed to load contact details:', err);
    return null;
  }
});

export const getArticles = cache(async (limit = 10): Promise<ArticleData[]> => {
  try {
    const articles = await prisma.article.findMany({
      where: { isActive: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        date: true,
        category: true,
        imageUrl: true,
      },
    });

    return articles;
  } catch (err) {
    console.error('Failed to load articles:', err);
    return [];
  }
});

export const getTestimonials = cache(async (limit = 20): Promise<TestimonialData[]> => {
  try {
    return await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, quote: true, stars: true, author: true },
    });
  } catch (err) {
    console.error('Failed to load testimonials:', err);
    return [];
  }
});

export const getSpecializations = cache(async (): Promise<SpecializationData[]> => {
  try {
    return await prisma.specialization.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, label: true, description: true, details: true },
    });
  } catch (err) {
    console.error('Failed to load specializations:', err);
    return [];
  }
});
