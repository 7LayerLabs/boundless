'use client';

import { ReactNode } from 'react';

interface CafeSceneProps {
  children: ReactNode;
}

export function CafeScene({ children }: CafeSceneProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Warm cafe background - late afternoon */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, #2d2520 0%, #1a1512 100%)
          `,
        }}
      />

      {/* Window light from left - soft daylight */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 0% 30%, rgba(255, 245, 220, 0.12) 0%, transparent 60%)',
        }}
      />

      {/* Warm overhead cafe lights */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255, 200, 120, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Secondary warm light - right side */}
      <div
        className="absolute top-1/3 right-0 w-[300px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 180, 100, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Cafe table surface - marble/wood blend */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%]">
        {/* Base marble-ish color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #3d3530 0%,
              #352e28 30%,
              #2d2620 60%,
              #252018 100%
            )`,
          }}
        />

        {/* Subtle marble veining */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                120deg,
                transparent 0px,
                transparent 20px,
                rgba(255, 250, 240, 0.1) 20px,
                rgba(255, 250, 240, 0.05) 22px,
                transparent 24px,
                transparent 80px
              )
            `,
          }}
        />

        {/* Surface sheen from window light */}
        <div
          className="absolute top-0 left-0 w-1/2 h-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 250, 240, 0.04) 0%, transparent 100%)',
          }}
        />

        {/* Table edge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, rgba(255, 240, 220, 0.12) 30%, rgba(255, 240, 220, 0.15) 50%, rgba(255, 240, 220, 0.12) 70%, transparent 95%)',
          }}
        />
      </div>

      {/* Coffee steam hint - very subtle */}
      <div
        className="absolute bottom-[45%] right-[15%] w-20 h-32 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main content area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>

      {/* Branding - bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1
          className="text-2xl font-serif tracking-wide"
          style={{
            color: 'rgba(220, 200, 180, 0.6)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          Boundless
        </h1>
        <p
          className="text-xs tracking-[0.2em] uppercase mt-0.5"
          style={{
            color: 'rgba(200, 180, 160, 0.5)',
          }}
        >
          Write without limits
        </p>
      </div>

      {/* Warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15, 10, 5, 0.5) 100%)',
        }}
      />

      {/* Film grain for realism */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
