/**
 * Image handling is deliberately strict: uploads are stored in Mongo and served
 * back from our own origin, so anything a browser might treat as markup or
 * script (HTML, SVG) would be a same-origin XSS. The stored content type is
 * derived from the file's magic bytes, never from the client-supplied MIME.
 */

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export function isAllowedImageType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

function startsWith(buffer: Buffer, bytes: number[], offset = 0): boolean {
  if (buffer.length < offset + bytes.length) return false;
  return bytes.every((byte, i) => buffer[offset + i] === byte);
}

/**
 * Sniffs the real image type from the file header. Returns null for anything
 * that is not a recognised raster image — including SVG, which is XML that can
 * carry a <script> tag.
 */
export function sniffImageType(buffer: Buffer): AllowedImageType | null {
  // JPEG: FF D8 FF
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';

  // GIF: "GIF8"
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return 'image/gif';

  // RIFF....WEBP
  if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)) {
    return 'image/webp';
  }

  // ISO-BMFF box "ftyp" at offset 4, with an AVIF brand
  if (startsWith(buffer, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = buffer.subarray(8, 12).toString('ascii');
    if (brand === 'avif' || brand === 'avis') return 'image/avif';
  }

  return null;
}

const FORBIDDEN_NAME_CHARS = new Set(['<', '>', ':', '"', '|', '?', '*']);

/** Strips path separators and control characters from a user-supplied filename. */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'upload';

  const cleaned = [...base]
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      return code > 31 && code !== 127 && !FORBIDDEN_NAME_CHARS.has(char);
    })
    .join('')
    .trim();

  return (cleaned || 'upload').slice(0, 200);
}
