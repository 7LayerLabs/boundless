'use client';

interface BookCoverProps {
  bindingColor: string;
  position: 'left' | 'right';
}

export function BookCover({ bindingColor, position }: BookCoverProps) {
  if (position === 'left') {
    return (
      <div
        className="hidden md:block relative w-16 md:w-24 h-full rounded-l-2xl flex-shrink-0"
        style={{
          backgroundColor: bindingColor,
          boxShadow: `
            inset -20px 0 40px rgba(0, 0, 0, 0.4),
            inset 0 0 60px rgba(0, 0, 0, 0.3),
            -8px 0 20px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        {/* Realistic leather texture */}
        <svg className="absolute inset-0 w-full h-full rounded-l-2xl pointer-events-none" preserveAspectRatio="none">
          <defs>
            <filter id="leatherLeft" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" seed="20" result="noise"/>
              <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="4" result="bump">
                <feDistantLight azimuth="135" elevation="45"/>
              </feDiffuseLighting>
            </filter>
            <filter id="grainLeft">
              <feTurbulence type="turbulence" baseFrequency="0.8" numOctaves="3"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#leatherLeft)" opacity="0.25"/>
          <rect width="100%" height="100%" filter="url(#grainLeft)" opacity="0.08"/>
        </svg>

        {/* Spine binding */}
        <div
          className="absolute right-0 top-0 bottom-0 w-4"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="hidden md:block relative w-4 md:w-6 h-full rounded-r-xl flex-shrink-0 overflow-hidden"
      style={{
        backgroundColor: bindingColor,
        boxShadow: `
          inset 10px 0 20px rgba(0, 0, 0, 0.3),
          8px 0 20px rgba(0, 0, 0, 0.2)
        `,
      }}
    >
      {/* Realistic leather texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          <filter id="leatherRight" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" seed="25" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="4" result="bump">
              <feDistantLight azimuth="135" elevation="45"/>
            </feDiffuseLighting>
          </filter>
          <filter id="grainRight">
            <feTurbulence type="turbulence" baseFrequency="0.8" numOctaves="3"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#leatherRight)" opacity="0.25"/>
        <rect width="100%" height="100%" filter="url(#grainRight)" opacity="0.08"/>
      </svg>
    </div>
  );
}
