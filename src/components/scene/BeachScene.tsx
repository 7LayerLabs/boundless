'use client';

import { ReactNode } from 'react';

interface BeachSceneProps {
  children: ReactNode;
}

export function BeachScene({ children }: BeachSceneProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Golden hour sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              #4a3f5c 0%,
              #6b5a6e 15%,
              #9d7a6a 30%,
              #c49a6c 45%,
              #d4a66a 55%,
              #c9a070 70%,
              #b8936a 100%
            )
          `,
        }}
      />

      {/* Sun glow on horizon */}
      <div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 200, 100, 0.25) 0%, rgba(255, 180, 80, 0.1) 30%, transparent 60%)',
        }}
      />

      {/* Subtle sun reflection */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[200px] h-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 220, 150, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Ocean layer */}
      <div className="absolute bottom-[35%] left-0 right-0 h-[20%]">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(100, 130, 150, 0.4) 0%,
              rgba(80, 110, 130, 0.5) 50%,
              rgba(70, 100, 120, 0.6) 100%
            )`,
          }}
        />
        {/* Ocean shimmer */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(255, 220, 180, 0.1) 2px,
                transparent 4px,
                transparent 20px
              )
            `,
          }}
        />
      </div>

      {/* Sandy beach surface */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%]">
        {/* Base sand color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #c4a882 0%,
              #b89b74 20%,
              #a88d68 50%,
              #9a8060 80%,
              #8a7355 100%
            )`,
          }}
        />

        {/* Sand texture - subtle grain */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                transparent 2px,
                rgba(180, 160, 120, 0.3) 2px,
                rgba(180, 160, 120, 0.3) 3px,
                transparent 3px,
                transparent 8px
              )
            `,
          }}
        />

        {/* Warm light reflection on sand */}
        <div
          className="absolute top-0 left-1/3 right-1/3 h-32"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 200, 120, 0.15) 0%, transparent 100%)',
          }}
        />

        {/* Beach/ocean edge */}
        <div
          className="absolute top-0 left-0 right-0 h-4"
          style={{
            background: 'linear-gradient(180deg, rgba(100, 130, 150, 0.3) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>

      {/* Branding - bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1
          className="text-3xl md:text-4xl font-serif tracking-wider"
          style={{
            color: 'rgba(90, 70, 50, 0.95)',
            textShadow: '0 2px 4px rgba(255,255,255,0.3), 0 0 20px rgba(100, 80, 60, 0.2)',
          }}
        >
          Boundless
        </h1>
        <p
          className="text-sm tracking-[0.25em] uppercase mt-1"
          style={{
            color: 'rgba(80, 60, 40, 0.85)',
          }}
        >
          Write without limits
        </p>
      </div>

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(60, 40, 30, 0.3) 100%)',
        }}
      />

      {/* Film grain for realism */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
