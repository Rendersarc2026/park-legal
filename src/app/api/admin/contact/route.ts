import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as yup from 'yup';

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
  name: yup.string().required('Contact name is required').test('no-script', 'Script tags are not allowed', noScript),
  phone: phoneValidation,
});

const contactDetailsSchema = yup.object({
  phone: phoneValidation,
  email: yup.string().email('Must be a valid email').required('Email address is required').test('no-script', 'Script tags are not allowed', noScript),
  address: yup.string().required('Address is required').test('no-script', 'Script tags are not allowed', noScript),
  directionsLink: yup.string().url('Must be a valid URL').required('Directions link is required').test('no-script', 'Script tags are not allowed', noScript),
  directContacts: yup.array().of(directContactSchema).required('Direct contacts list is required'),
});

export async function GET() {
  try {
    if (!prisma || !prisma.contactDetails) {
      return NextResponse.json({ error: 'Database model not initialized. Please restart the dev server.' }, { status: 500 });
    }
    const contact = await prisma.contactDetails.findFirst({
      where: { isActive: true }
    });
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact details not found' }, { status: 404 });
    }
    
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contact details' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!prisma || !prisma.contactDetails) {
      return NextResponse.json({ error: 'Database model not initialized. Please restart the dev server.' }, { status: 500 });
    }
    const bodyJson = await request.json();
    
    // Backend validation using Yup
    const validatedData = await contactDetailsSchema.validate(bodyJson, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    const existing = await prisma.contactDetails.findFirst();
    
    if (existing) {
      const updated = await prisma.contactDetails.update({
        where: { id: existing.id },
        data: {
          phone: validatedData.phone,
          email: validatedData.email,
          address: validatedData.address,
          directionsLink: validatedData.directionsLink,
          directContacts: validatedData.directContacts,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.contactDetails.create({
        data: {
          phone: validatedData.phone,
          email: validatedData.email,
          address: validatedData.address,
          directionsLink: validatedData.directionsLink,
          directContacts: validatedData.directContacts,
        },
      });
      return NextResponse.json(created);
    }
  } catch (err: unknown) {
    if (err instanceof yup.ValidationError) {
      return NextResponse.json({ error: err.errors[0] }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save contact details' }, { status: 500 });
  }
}
