'use client';

interface LeatherTextureProps {
  className?: string;
}

export function LeatherTexture({ className }: LeatherTextureProps) {
  return (
    <div className={className}>
      {/* Base leather grain - large bumps */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="leatherGrain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="6"
              seed="15"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#ffffff"
              surfaceScale="3"
              result="light"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#leatherGrain)" opacity="0.15" />
      </svg>

      {/* Fine grain texture */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="fineGrain">
            <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="4" seed="5" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#fineGrain)" opacity="0.08" />
      </svg>

      {/* Pore details */}
      <svg className="absolute inset-0 w-full h-full mix-blend-overlay" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="pores">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" seed="42" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#pores)" opacity="0.05" />
      </svg>
    </div>
  );
}
