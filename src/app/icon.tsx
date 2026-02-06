import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  const logoPath = join(process.cwd(), 'public/assets/logo.png');
  const logoData = readFileSync(logoPath);
  const base64Logo = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'transparent', 
        }}
      >
        <img src={base64Logo} alt="Icon" width="100%" height="100%" style={{ objectFit: 'cover' }} />
      </div>
    ),
    {
      ...size,
    }
  );
}
