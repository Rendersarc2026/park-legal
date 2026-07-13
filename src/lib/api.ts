import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Prisma messages can echo back the query and schema shape, so they are logged
 * server-side and never returned to the caller.
 */
export function serverError(context: string, err: unknown) {
  console.error(context, err);
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}

export function isRecordNotFound(err: unknown): boolean {
  return (err as { code?: string })?.code === 'P2025';
}

/** MongoDB ObjectId — anything else makes Prisma throw rather than return null. */
export function isValidObjectId(id: unknown): id is string {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}

/** Refresh the public pages that render CMS content. */
export function revalidateContent(...paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
