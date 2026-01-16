'use client';

import { ReactNode } from 'react';

interface DeskSceneProps {
  children: ReactNode;
}

export function DeskScene({ children }: DeskSceneProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deep atmospheric background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, #1a1714 0%, #0d0b0a 100%)
          `,
        }}
      />

      {/* Subtle warm desk lamp glow from top-left */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 180, 100, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Secondary ambient fill light */}
      <div
        className="absolute top-1/4 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(200, 170, 140, 0.03) 0%, transparent 70%)',
        }}
      />

      {/* Rich wooden desk surface */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%]">
        {/* Base wood color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #2a1f18 0%,
              #231a14 30%,
              #1c1510 60%,
              #1a1310 100%
            )`,
          }}
        />

        {/* Realistic wood grain - horizontal */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 3px,
                rgba(60, 40, 25, 0.3) 3px,
                rgba(60, 40, 25, 0.3) 4px,
                transparent 4px,
                transparent 15px
              )
            `,
          }}
        />

        {/* Wood grain variation - wavy lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                88deg,
                transparent 0px,
                rgba(80, 50, 30, 0.2) 1px,
                transparent 2px,
                transparent 40px
              )
            `,
          }}
        />

        {/* Subtle surface reflection/sheen */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 200, 150, 0.03) 0%, transparent 100%)',
          }}
        />

        {/* Desk edge - subtle highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255, 220, 180, 0.15) 30%, rgba(255, 220, 180, 0.2) 50%, rgba(255, 220, 180, 0.15) 70%, transparent 90%)',
          }}
        />

        {/* Desk depth shadow */}
        <div
          className="absolute top-0 left-0 right-0 h-8"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, transparent 100%)',
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
          className="text-2xl font-serif tracking-wide"
          style={{
            color: 'rgba(180, 160, 140, 0.4)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          Boundless
        </h1>
        <p
          className="text-xs tracking-[0.2em] uppercase mt-0.5"
          style={{
            color: 'rgba(160, 140, 120, 0.3)',
          }}
        >
          Write without limits
        </p>
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Film grain for realism */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
