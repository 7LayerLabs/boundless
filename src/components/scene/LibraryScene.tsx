'use client';

import { ReactNode } from 'react';

interface LibrarySceneProps {
  children: ReactNode;
}

export function LibraryScene({ children }: LibrarySceneProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deep library atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, #1e1a18 0%, #12100e 100%)
          `,
        }}
      />

      {/* Green reading lamp glow - classic banker's lamp */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(100, 180, 100, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Secondary warm ambient light */}
      <div
        className="absolute top-0 right-[10%] w-[300px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 200, 150, 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Bookshelf hints - left side */}
      <div className="absolute top-0 left-0 w-[15%] h-full opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                180deg,
                #2a2018 0px,
                #2a2018 60px,
                #1a1510 60px,
                #1a1510 65px,
                #2a2018 65px,
                #2a2018 125px
              )
            `,
          }}
        />
        {/* Book spines color variation */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                180deg,
                rgba(139, 69, 69, 0.3) 0px,
                rgba(139, 69, 69, 0.3) 20px,
                rgba(69, 90, 100, 0.3) 20px,
                rgba(69, 90, 100, 0.3) 35px,
                rgba(34, 85, 51, 0.3) 35px,
                rgba(34, 85, 51, 0.3) 55px,
                rgba(139, 119, 69, 0.3) 55px,
                rgba(139, 119, 69, 0.3) 70px
              )
            `,
          }}
        />
      </div>

      {/* Bookshelf hints - right side */}
      <div className="absolute top-0 right-0 w-[15%] h-full opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                180deg,
                #2a2018 0px,
                #2a2018 55px,
                #1a1510 55px,
                #1a1510 60px,
                #2a2018 60px,
                #2a2018 120px
              )
            `,
          }}
        />
        {/* Book spines color variation */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                180deg,
                rgba(69, 69, 139, 0.3) 0px,
                rgba(69, 69, 139, 0.3) 25px,
                rgba(139, 89, 69, 0.3) 25px,
                rgba(139, 89, 69, 0.3) 45px,
                rgba(100, 69, 69, 0.3) 45px,
                rgba(100, 69, 69, 0.3) 60px,
                rgba(69, 100, 69, 0.3) 60px,
                rgba(69, 100, 69, 0.3) 80px
              )
            `,
          }}
        />
      </div>

      {/* Rich mahogany desk surface */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%]">
        {/* Base mahogany color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #3a2820 0%,
              #2e2018 30%,
              #261a14 60%,
              #1e1410 100%
            )`,
          }}
        />

        {/* Wood grain pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 4px,
                rgba(80, 40, 20, 0.3) 4px,
                rgba(80, 40, 20, 0.3) 5px,
                transparent 5px,
                transparent 20px
              )
            `,
          }}
        />

        {/* Leather desk pad hint */}
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] rounded-sm opacity-30"
          style={{
            background: 'linear-gradient(180deg, #1a2a1a 0%, #152015 100%)',
            border: '1px solid rgba(100, 80, 60, 0.2)',
          }}
        />

        {/* Green lamp light on desk */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-40"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(100, 180, 100, 0.06) 0%, transparent 70%)',
          }}
        />

        {/* Desk edge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(200, 160, 120, 0.15) 30%, rgba(200, 160, 120, 0.2) 50%, rgba(200, 160, 120, 0.15) 70%, transparent 90%)',
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
            color: 'rgba(200, 180, 155, 0.9)',
            textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(160, 140, 120, 0.3)',
          }}
        >
          Boundless
        </h1>
        <p
          className="text-sm tracking-[0.25em] uppercase mt-1"
          style={{
            color: 'rgba(180, 160, 135, 0.75)',
          }}
        >
          Write without limits
        </p>
      </div>

      {/* Classic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0, 0, 0, 0.55) 100%)',
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
