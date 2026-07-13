import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, setSessionCookie, signSession } from '@/lib/auth';
import { badRequest, serverError } from '@/lib/api';
import bcrypt from 'bcryptjs';
import * as yup from 'yup';

export const dynamic = 'force-dynamic';

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(10, 'New password must be at least 10 characters')
    .max(200, 'New password is too long')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export async function POST(request: Request) {
  const { session, response: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = await changePasswordSchema.validate(
      await request.json(),
      { abortEarly: false, stripUnknown: true }
    );

    const admin = await prisma.adminUser.findUnique({ where: { username: session.username } });

    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return badRequest('Current password is incorrect');
    }

    if (await bcrypt.compare(newPassword, admin.password)) {
      return badRequest('New password must be different from current password');
    }

    await prisma.adminUser.update({
      where: { username: session.username },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    // Issue a fresh session so the rest of the 12h window runs on a token minted
    // after the password change.
    const response = NextResponse.json({ success: true, message: 'Password changed successfully' });
    setSessionCookie(response, await signSession(admin.username));
    return response;
  } catch (err) {
    if (err instanceof yup.ValidationError) return badRequest(err.errors[0]);
    return serverError('Change password error:', err);
  }
}
