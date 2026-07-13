import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { badRequest, notFound, revalidateContent, serverError } from '@/lib/api';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const noScript = (value: string | undefined): boolean => {
  if (!value) return true;
  return !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value);
};

const phoneRegex = /^\+91\s?[0-9\s\-()]{10,20}$/;

const phoneValidation = yup.string()
  .matches(phoneRegex, 'Phone number must start with +91')
  .test('exactly-10-digits', 'Phone number must have exactly 10 digits after the country code', (value) => {
    if (!value) return false;
    const rawNumber = value.replace(/^\+91\s?/, '');
    const digitsOnly = rawNumber.replace(/\D/g, '');
    return digitsOnly.length === 10;
  })
  .test('no-script', 'Script tags are not allowed', noScript)
  .required('Phone number is required');

const directContactSchema = yup.object({
  name: yup.string().trim().max(200).required('Contact name is required').test('no-script', 'Script tags are not allowed', noScript),
  phone: phoneValidation,
});

const contactDetailsSchema = yup.object({
  phone: phoneValidation,
  email: yup.string().trim().max(320).email('Must be a valid email').required('Email address is required').test('no-script', 'Script tags are not allowed', noScript),
  address: yup.string().trim().max(1000).required('Address is required').test('no-script', 'Script tags are not allowed', noScript),
  // Rendered straight into an href, so only http(s) is accepted — this is what
  // keeps a javascript: URL out of the link.
  directionsLink: yup
    .string()
    .trim()
    .max(2000)
    .url('Must be a valid URL')
    .matches(/^https?:\/\//i, 'Directions link must start with http:// or https://')
    .required('Directions link is required'),
  directContacts: yup.array().of(directContactSchema).max(20).required('Direct contacts list is required'),
});

export async function GET() {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const contact = await prisma.contactDetails.findFirst({ where: { isActive: true } });

    if (!contact) return notFound('Contact details not found');

    return NextResponse.json(contact);
  } catch (err) {
    return serverError('Failed to fetch contact details:', err);
  }
}

export async function POST(request: Request) {
  const { response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const data = await contactDetailsSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const existing = await prisma.contactDetails.findFirst();

    const saved = existing
      ? await prisma.contactDetails.update({ where: { id: existing.id }, data })
      : await prisma.contactDetails.create({ data });

    // The footer renders contact details on every public page.
    revalidateContent('/', '/about', '/contact');
    return NextResponse.json(saved);
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Failed to save contact details:', err);
  }
}
