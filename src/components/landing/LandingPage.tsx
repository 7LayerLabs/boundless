'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Feather,
  Lock,
  Palette,
  Calendar,
  BarChart3,
  Compass,
  Quote,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Page turn section wrapper for scroll-driven animations
interface PageTurnSectionProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

function PageTurnSection({ children, className = '', dark = false }: PageTurnSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.3'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  // Shadow that appears at the "fold" during page turn
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.15, 0]);

  return (
    <div ref={ref} className="relative" style={{ perspective: '1200px' }}>
      {/* Page fold shadow */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          opacity: shadowOpacity,
          background: dark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)'
            : 'linear-gradient(to bottom, rgba(44, 24, 16, 0.15), transparent)',
        }}
      />
      <motion.section
        style={{
          rotateX,
          opacity,
          y,
          scale,
          transformOrigin: 'top center',
        }}
        className={className}
      >
        {children}
      </motion.section>
    </div>
  );
}

// Playfair Display is loaded via CSS variable --font-playfair
const serifFont = 'var(--font-playfair), Georgia, serif';

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Features for open-book sticky scroll - lead with high-value differentiators
  const bookFeatures = [
    {
      emoji: '🧭',
      title: '42 Guided Programs',
      description: 'Structured multi-day journeys for real growth—not generic prompts.',
      detail: 'Wellness, life story, business, relationships, creativity. Each program is psychologically-informed with 14-30 days of sequenced prompts.',
    },
    {
      emoji: '🪞',
      title: 'AI Reflection Companion',
      description: 'Questions that help you explore your own thoughts—never tells you what to think.',
      detail: 'Therapeutic questioning that reflects what you wrote and invites you to look closer. Explores, never leads.',
    },
    {
      emoji: '✨',
      title: 'Never Face a Blank Page',
      description: 'Daily prompts, templates, and inspiration when you need it.',
      detail: '200+ thoughtful prompts across 12 categories. Writing templates for gratitude, reflection, goals, and more.',
    },
    {
      emoji: '💭',
      title: 'Mood Insights & Patterns',
      description: 'Track how you feel and discover emotional patterns over time.',
      detail: 'Simple mood logging with beautiful visualizations. See trends, identify triggers, understand yourself better.',
    },
    {
      emoji: '🔐',
      title: 'Private & Secure',
      description: 'Your thoughts are protected. PIN lock, local storage, no cloud access.',
      detail: 'Your journal is yours alone. We can\'t read your entries—and neither can anyone else.',
    },
    {
      emoji: '📖',
      title: 'Beautiful & Customizable',
      description: 'A journal that feels real—leather bindings, paper textures, handwriting fonts.',
      detail: '6 binding colors, 4 page styles, 12 fonts, 8 ink colors. Make it yours.',
    },
  ];

  const proFeatures = [
    {
      icon: <Compass className="w-5 h-5" />,
      title: '42 Guided Programs',
      description: 'Curated journeys across 5 categories—not generic templates',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Writing Companion',
      description: 'Therapeutic questions that help you explore—never lead',
    },
    {
      icon: <Quote className="w-5 h-5" />,
      title: 'Daily Quotes',
      description: 'Curated inspiration to start your writing',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Writing Stats',
      description: 'Track words, streaks, and progress',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f3] overflow-x-hidden">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2c1810] flex items-center justify-center shadow-lg">
              <span className="text-[#d4a574] font-serif font-bold text-xl">B</span>
            </div>
            <span className="font-serif text-2xl font-bold text-[#2c1810] tracking-tight">
              Boundless
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="relative px-5 py-2.5 bg-[#f5f0e8] text-[#2c1810] font-medium text-sm transition-all hover:-translate-y-0.5"
            style={{
              boxShadow: '0 2px 8px -2px rgba(44, 24, 16, 0.15), 0 1px 3px rgba(44, 24, 16, 0.1)',
              borderRadius: '3px',
              border: '1px solid rgba(44, 24, 16, 0.12)',
            }}
          >
            Start Writing
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#d4a574]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#8b4513]/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[#2c1810] leading-[0.95] tracking-tight mb-6"
          >
            The journal that
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">feels real</span>
              {/* Hand-drawn underline SVG */}
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 w-full h-4 z-0"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 8 C 30 4, 50 10, 80 6 S 130 8, 160 5 S 190 9, 198 7"
                  stroke="#8b4513"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-[#5c3d2e]/80 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            Private, customizable, and built for meaningful reflection.
          </motion.p>

          {/* Support line - principle statement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <span className="inline-block px-5 py-2.5 bg-[#2c1810] text-[#f5f0e6] text-xs md:text-sm uppercase tracking-[0.2em] font-medium rounded">
              Questions that explore, never lead.
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group relative flex items-center gap-2 px-8 py-4 bg-[#f5f0e8] text-[#2c1810] font-medium text-lg transition-all hover:-translate-y-0.5"
              style={{
                boxShadow: '0 4px 12px -2px rgba(44, 24, 16, 0.15), 0 2px 4px -1px rgba(44, 24, 16, 0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                borderRadius: '4px',
                border: '1px solid rgba(44, 24, 16, 0.1)',
              }}
            >
              {/* Paper texture overlay */}
              <span
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
                  borderRadius: '4px',
                }}
              />
              <span className="relative">Start Your Journal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
              {/* Folded corner effect */}
              <span
                className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-[#e8e0d4] to-[#d4cdc0]"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                  borderBottomLeftRadius: '2px',
                }}
              />
            </button>
            <span className="text-sm text-[#8b7355]">Free forever • No credit card</span>
          </motion.div>

          {/* Journal Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.8, duration: 1, type: 'spring' }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-3xl">
              {/* Shadow/glow effect - deeper, more realistic */}
              <div
                className="absolute inset-0 transform translate-y-8"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(44, 24, 16, 0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Journal mockup - open book style */}
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  boxShadow: '0 30px 60px -20px rgba(44, 24, 16, 0.5), 0 15px 30px -15px rgba(44, 24, 16, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Leather cover with stitching */}
                <div className="relative bg-gradient-to-br from-[#5c3a21] via-[#4a2f1a] to-[#3d251a] p-1.5">
                  {/* Leather texture - more pronounced */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Stitching along edges */}
                  <div className="absolute top-3 left-3 right-3 h-px opacity-40">
                    <svg className="w-full h-2" preserveAspectRatio="none">
                      <pattern id="stitch-h" patternUnits="userSpaceOnUse" width="12" height="2">
                        <line x1="0" y1="1" x2="6" y2="1" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" />
                      </pattern>
                      <rect width="100%" height="2" fill="url(#stitch-h)" />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 h-px opacity-40">
                    <svg className="w-full h-2" preserveAspectRatio="none">
                      <pattern id="stitch-h2" patternUnits="userSpaceOnUse" width="12" height="2">
                        <line x1="0" y1="1" x2="6" y2="1" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" />
                      </pattern>
                      <rect width="100%" height="2" fill="url(#stitch-h2)" />
                    </svg>
                  </div>

                  {/* Gold clasp - more detailed */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20">
                    <div
                      className="w-14 h-7 bg-gradient-to-b from-[#e5c088] via-[#d4a574] to-[#b8956a] rounded-b-md"
                      style={{
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                      }}
                    >
                      {/* Clasp detail */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#8b6914]/30 rounded-full" />
                    </div>
                  </div>

                  {/* Inner page - aged paper effect */}
                  <div
                    className="relative bg-gradient-to-br from-[#faf8f3] via-[#f5f0e6] to-[#efe8dc] rounded-sm min-h-[420px] overflow-hidden"
                    style={{
                      boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.05), inset -1px -1px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Paper grain texture */}
                    <div
                      className="absolute inset-0 opacity-50 pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23f5f0e6' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Aged/worn edges - subtle coffee stain effect */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at top right, #8b4513, transparent 70%)',
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-24 h-24 opacity-[0.02] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at bottom left, #5c3d2e, transparent 70%)',
                      }}
                    />

                    {/* Page lines - hand-ruled feel */}
                    <div
                      className="absolute inset-8 md:inset-12 pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 30px, rgba(180, 160, 140, 0.15) 30px, rgba(180, 160, 140, 0.15) 31px)',
                      }}
                    />

                    {/* Red margin line */}
                    <div className="absolute top-8 bottom-8 md:top-12 md:bottom-12 left-16 md:left-20 w-px bg-[#c9a0a0]/20" />

                    {/* Content preview */}
                    <div className="relative p-8 md:p-12 pl-20 md:pl-24">
                      <p className="text-[#8b7355] text-xs tracking-widest mb-3 font-medium uppercase">January 18, 2026</p>
                      <p
                        className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2c1810]/90 leading-relaxed"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        Today I realized that the small moments are the ones worth remembering. The morning coffee, the way light came through the window, the quiet before everyone woke up...
                      </p>
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="text-2xl">😊</span>
                        <span
                          className="px-3 py-1 text-[#5c3d2e] text-sm border border-[#d4a574]/30 rounded"
                          style={{ background: 'linear-gradient(to bottom, #faf8f3, #f0e8dc)' }}
                        >
                          #grateful
                        </span>
                        <span
                          className="px-3 py-1 text-[#5c3d2e] text-sm border border-[#d4a574]/30 rounded"
                          style={{ background: 'linear-gradient(to bottom, #faf8f3, #f0e8dc)' }}
                        >
                          #reflection
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-[#2c1810]/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#2c1810]/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section - Open Book Sticky Scroll */}
      <PageTurnSection className="relative bg-[#faf8f3]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-4">
              Everything you need to write
            </h2>
            <p className="text-lg text-[#5c3d2e]/70 max-w-xl mx-auto">
              A thoughtfully designed space for your daily reflections
            </p>
          </div>

          {/* Open book layout with sticky scroll */}
          <div className="relative">
            {bookFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="min-h-[70vh] flex items-center py-12"
              >
                {/* Open book spread */}
                <div
                  className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden"
                  style={{
                    boxShadow: '0 20px 50px -15px rgba(44, 24, 16, 0.3), 0 10px 20px -10px rgba(44, 24, 16, 0.2)',
                  }}
                >
                  {/* Book binding spine in center */}
                  <div className="grid md:grid-cols-2">
                    {/* Left page - Feature info */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-20%' }}
                      className="relative bg-gradient-to-br from-[#faf8f3] via-[#f5f0e6] to-[#efe8dc] p-8 md:p-12 min-h-[400px] flex flex-col justify-center"
                      style={{
                        boxShadow: 'inset -8px 0 20px -10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* Paper texture */}
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {/* Page number */}
                      <span className="absolute top-6 left-8 text-xs text-[#8b7355]/50 font-medium">
                        {String(index * 2 + 1).padStart(2, '0')}
                      </span>
                      {/* Content */}
                      <div className="relative">
                        <span className="text-5xl mb-6 block">{feature.emoji}</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2c1810] mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-[#5c3d2e]/80 text-lg leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <p className="text-[#8b7355] text-sm italic">
                          {feature.detail}
                        </p>
                      </div>
                    </motion.div>

                    {/* Right page - Feature-specific illustration */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-20%' }}
                      transition={{ delay: 0.1 }}
                      className="relative bg-gradient-to-bl from-[#faf8f3] via-[#f5f0e6] to-[#efe8dc] p-8 md:p-12 min-h-[400px] flex items-center justify-center"
                      style={{
                        boxShadow: 'inset 8px 0 20px -10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* Paper texture */}
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper2)' opacity='0.3'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {/* Page number */}
                      <span className="absolute top-6 right-8 text-xs text-[#8b7355]/50 font-medium">
                        {String(index * 2 + 2).padStart(2, '0')}
                      </span>

                      {/* Feature-specific content */}
                      <div className="relative w-full text-center">
                        {/* Feature 0: 42 Guided Programs - Show program categories */}
                        {index === 0 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-left">
                              {[
                                { emoji: '🌱', name: 'Wellness', count: '12' },
                                { emoji: '📖', name: 'Life Story', count: '8' },
                                { emoji: '✨', name: 'Business', count: '9' },
                                { emoji: '💕', name: 'Relationships', count: '7' },
                                { emoji: '🎨', name: 'Creativity', count: '6' },
                              ].map((cat, i) => (
                                <div key={i} className="bg-white/80 rounded-lg p-3 shadow-sm border border-[#d4a574]/20">
                                  <span className="text-lg">{cat.emoji}</span>
                                  <p className="text-sm font-medium text-[#2c1810]">{cat.name}</p>
                                  <p className="text-xs text-[#8b7355]">{cat.count} programs</p>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-[#8b7355]/60 mt-2">14-30 day structured journeys</p>
                          </div>
                        )}

                        {/* Feature 1: AI Reflection Companion - Show example interaction */}
                        {index === 1 && (
                          <div className="space-y-4 text-left">
                            <div className="bg-white rounded-xl p-4 shadow-md border border-[#d4a574]/20">
                              <p className="text-xs text-[#8b7355] mb-2">You wrote:</p>
                              <p className="text-sm text-[#2c1810] italic mb-4">"I felt overwhelmed at work today..."</p>
                              <div className="border-t border-[#d4a574]/20 pt-3">
                                <p className="text-xs text-[#d4a574] mb-2 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> AI reflects:
                                </p>
                                <p className="text-sm text-[#2c1810]">"When you say overwhelmed, what does that feel like in your body?"</p>
                              </div>
                            </div>
                            <p className="text-xs text-[#8b7355] text-center">Explores, never leads</p>
                          </div>
                        )}

                        {/* Feature 2: Never Face a Blank Page - Show prompts */}
                        {index === 2 && (
                          <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 shadow-md border border-[#d4a574]/20 text-left">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">💡</span>
                                <span className="text-xs text-[#8b7355] uppercase tracking-wider">Today's Prompt</span>
                              </div>
                              <p className="text-[#2c1810] font-serif text-lg italic leading-relaxed">
                                "What's something small that brought you unexpected joy recently?"
                              </p>
                            </div>
                            <div className="flex justify-center gap-2 flex-wrap">
                              {['Gratitude', 'Reflection', 'Goals', 'Memories'].map((cat, i) => (
                                <span key={i} className="px-3 py-1 bg-[#d4a574]/10 text-[#5c3d2e] text-xs rounded-full">{cat}</span>
                              ))}
                            </div>
                            <p className="text-xs text-[#8b7355]">200+ prompts across 12 categories</p>
                          </div>
                        )}

                        {/* Feature 3: Mood Insights - Show mood tracking */}
                        {index === 3 && (
                          <div className="space-y-6">
                            <div className="flex justify-center gap-4 text-3xl">
                              <span className="hover:scale-125 transition-transform cursor-pointer">😢</span>
                              <span className="hover:scale-125 transition-transform cursor-pointer">😐</span>
                              <span className="hover:scale-125 transition-transform cursor-pointer">🙂</span>
                              <span className="hover:scale-125 transition-transform cursor-pointer">😊</span>
                              <span className="hover:scale-125 transition-transform cursor-pointer">🥰</span>
                            </div>
                            <div className="h-16 flex items-end justify-center gap-1.5">
                              {[40, 55, 70, 85, 60, 75, 90].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-6 rounded-t-sm bg-gradient-to-t from-[#d4a574] to-[#e5c088]"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-[#8b7355]">See your emotional patterns over time</p>
                          </div>
                        )}

                        {/* Feature 4: Private & Secure - Show lock */}
                        {index === 4 && (
                          <div className="space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#d4a574] to-[#8b6914] flex items-center justify-center shadow-lg">
                              <Lock className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[#2c1810] font-medium">Your words, protected</p>
                              <p className="text-sm text-[#8b7355]">PIN lock • Local storage</p>
                              <p className="text-sm text-[#8b7355]">We never see your entries</p>
                            </div>
                          </div>
                        )}

                        {/* Feature 5: Beautiful & Customizable - Show options */}
                        {index === 5 && (
                          <div className="space-y-5">
                            <div className="space-y-3">
                              <p className="text-xs text-[#8b7355] uppercase tracking-wider">Bindings</p>
                              <div className="flex justify-center gap-2">
                                {['#5c3a21', '#2c1810', '#8b4513', '#654321', '#4a3728', '#3d251a'].map((color, i) => (
                                  <div key={i} className="w-8 h-12 rounded-sm shadow-md" style={{ background: color }} />
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-xs text-[#8b7355] uppercase tracking-wider">Fonts & Colors</p>
                              <div className="flex justify-center items-center gap-4">
                                <span style={{ fontFamily: 'Georgia, serif' }} className="text-xl text-[#2c1810]">Aa</span>
                                <span style={{ fontFamily: 'cursive' }} className="text-xl text-[#1e3a5f]">Aa</span>
                                <span style={{ fontFamily: 'serif' }} className="text-xl italic text-[#2d4a3e]">Aa</span>
                              </div>
                            </div>
                            <p className="text-xs text-[#8b7355]">Make it truly yours</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Book spine shadow */}
                  <div
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 pointer-events-none hidden md:block"
                    style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent 30%, transparent 70%, rgba(0,0,0,0.15))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageTurnSection>

      {/* Social Proof Section */}
      <PageTurnSection className="relative py-24 px-6 bg-[#f5f0e6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2c1810] mb-4">
              Real entries, real reflections
            </h2>
            <p className="text-[#5c3d2e]/70">
              Shared with permission from our community
            </p>
          </motion.div>

          {/* Journal excerpts - styled like torn paper notes */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                excerpt: "I finally wrote down the thing I've been avoiding for months. Seeing it on paper made it feel less scary, more... manageable.",
                mood: '😌',
                tag: 'breakthrough',
              },
              {
                excerpt: "Three weeks of morning pages. I'm noticing I'm less anxious before work. The ritual of opening my journal has become a kind of anchor.",
                mood: '🌅',
                tag: 'routine',
              },
              {
                excerpt: "The prompt asked what I'd tell my younger self. I didn't expect to cry, but I also didn't expect to feel so much compassion for who I was.",
                mood: '💧',
                tag: 'healing',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotate: -1 + index }}
                whileInView={{ opacity: 1, y: 0, rotate: -1 + index }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className="bg-[#faf8f3] p-6 rounded-sm"
                  style={{
                    boxShadow: '0 4px 20px -5px rgba(44, 24, 16, 0.15)',
                    transform: `rotate(${-1 + index}deg)`,
                  }}
                >
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none rounded-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`,
                    }}
                  />
                  {/* Torn top edge effect */}
                  <div
                    className="absolute -top-1 left-0 right-0 h-2 bg-[#faf8f3]"
                    style={{
                      clipPath: 'polygon(0 100%, 5% 60%, 10% 100%, 15% 40%, 20% 100%, 25% 70%, 30% 100%, 35% 50%, 40% 100%, 45% 60%, 50% 100%, 55% 40%, 60% 100%, 65% 70%, 70% 100%, 75% 50%, 80% 100%, 85% 60%, 90% 100%, 95% 40%, 100% 100%)',
                    }}
                  />
                  <p className="text-[#2c1810]/80 text-sm leading-relaxed italic relative z-10 mb-4">
                    "{item.excerpt}"
                  </p>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-lg">{item.mood}</span>
                    <span className="text-xs text-[#8b7355] bg-[#d4a574]/10 px-2 py-0.5 rounded">
                      #{item.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "I've tried every journaling app. Boundless is the first one that made me want to write.",
                name: 'Sarah M.',
                role: 'Using Boundless for 8 months',
              },
              {
                quote: "The AI questions surprised me. They're not leading—they're like having a thoughtful friend who just listens.",
                name: 'James K.',
                role: 'Pro subscriber',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4 p-6 bg-white/60 rounded-2xl border border-[#2c1810]/5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4a574] to-[#8b4513] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#2c1810] mb-3">"{testimonial.quote}"</p>
                  <p className="text-sm font-medium text-[#5c3d2e]">{testimonial.name}</p>
                  <p className="text-xs text-[#8b7355]">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageTurnSection>

      {/* Why Boundless Story Section */}
      <PageTurnSection className="relative py-24 px-6 bg-[#faf8f3]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-4xl mb-6 block">📝</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2c1810] mb-8">
              Why I built Boundless
            </h2>
            <div className="text-left space-y-4 text-[#5c3d2e]/80 leading-relaxed">
              <p>
                I've kept a journal since I was sixteen. Physical notebooks filled with messy handwriting, coffee stains, and the kind of honesty I couldn't share anywhere else.
              </p>
              <p>
                When I tried digital journaling, every app felt... clinical. Productivity tools dressed up as journals. None of them understood that journaling isn't about tracking habits—it's about having a private space to think out loud.
              </p>
              <p>
                So I built what I wanted: a digital journal that feels like the real thing. One that respects privacy, invites honest writing, and doesn't try to optimize your inner life.
              </p>
              <p className="text-[#2c1810] font-medium">
                Boundless is the journal I wanted to exist.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-[#2c1810]/10">
              <p className="text-sm text-[#8b7355]">— Derek, Founder</p>
            </div>
          </motion.div>
        </div>
      </PageTurnSection>

      {/* Unified Pro Section - Programs + AI Mirror */}
      <PageTurnSection dark className="relative py-32 px-6 bg-gradient-to-b from-[#2c1810] to-[#3d251a] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4a574]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a574]/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Pro badge and main header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a574]/20 rounded-full mb-6 border border-[#d4a574]/30">
              <Star className="w-4 h-4 text-[#d4a574] fill-current" />
              <span className="text-sm font-medium text-[#d4a574]">Boundless Pro</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Go deeper with Pro
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Guided programs and an AI companion designed to help you explore—never lead
            </p>
          </motion.div>

          {/* Two-column layout: Programs + AI */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left: 42 Programs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Compass className="w-6 h-6 text-[#d4a574]" />
                <h3 className="font-serif text-2xl font-bold text-white">42 Guided Programs</h3>
              </div>
              <p className="text-white/70 mb-6">
                Not generic templates—each is a psychologically-informed journey with 14-30 days of thoughtfully sequenced prompts.
              </p>

              {/* Compact category list */}
              <div className="space-y-3 mb-6">
                {[
                  { emoji: '🌱', name: 'Wellness & Growth', examples: 'Anxiety Toolkit, Burnout Recovery' },
                  { emoji: '📖', name: 'My Story & Legacy', examples: 'Life Story, Wisdom for Children' },
                  { emoji: '✨', name: 'Business & Dreams', examples: 'Career Pivot, Money Mindset' },
                  { emoji: '💕', name: 'Relationships', examples: 'Finding Love, Self-Love Journey' },
                  { emoji: '🎨', name: 'Creativity', examples: "Writer's Journal, Unlock Creativity" },
                ].map((cat) => (
                  <div key={cat.name} className="flex items-start gap-3">
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <p className="text-white font-medium">{cat.name}</p>
                      <p className="text-sm text-white/50">{cat.examples}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample prompt */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-[#d4a574] font-medium mb-2">SAMPLE FROM "MY LIFE STORY"</p>
                <p className="text-white/80 text-sm italic">
                  "Describe your earliest childhood memory. What do you see, hear, and feel?"
                </p>
              </div>
            </motion.div>

            {/* Right: AI Mirror */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-[#d4a574]" />
                <h3 className="font-serif text-2xl font-bold text-white">AI Mirror Companion</h3>
              </div>
              <p className="text-white/70 mb-6">
                Therapeutic questioning that reflects what you wrote and asks you to look closer—never tells you what to think.
              </p>

              {/* AI methodology */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🪞</span>
                  <div>
                    <p className="text-white font-medium">Reflects</p>
                    <p className="text-sm text-white/50">"You said it felt heavy. What kind of heavy?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌊</span>
                  <div>
                    <p className="text-white font-medium">Grounds</p>
                    <p className="text-sm text-white/50">"What were you noticing in your body?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">👁️</span>
                  <div>
                    <p className="text-white font-medium">Steps Back</p>
                    <p className="text-sm text-white/50">"When you read that back, what stands out?"</p>
                  </div>
                </div>
              </div>

              {/* What AI never does */}
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-xs text-red-300 font-medium mb-2">WHAT IT NEVER DOES</p>
                <div className="space-y-1 text-sm text-white/60">
                  <p className="line-through decoration-red-400/50">Labels your feelings</p>
                  <p className="line-through decoration-red-400/50">Gives advice</p>
                  <p className="line-through decoration-red-400/50">Leads to conclusions</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Pro features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: <Quote className="w-4 h-4" />, label: 'Daily Quotes' },
              { icon: <BarChart3 className="w-4 h-4" />, label: 'Writing Stats' },
              { icon: <BookOpen className="w-4 h-4" />, label: 'Entry Templates' },
              { icon: <Feather className="w-4 h-4" />, label: 'PDF Export' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/70 text-sm"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </PageTurnSection>

      {/* Pricing Section */}
      <PageTurnSection className="relative py-32 px-6 bg-gradient-to-b from-transparent via-[#2c1810]/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-lg text-[#5c3d2e]/70">
              Start free, upgrade when you're ready
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 bg-white rounded-3xl border border-[#2c1810]/10 shadow-lg"
            >
              <h3 className="font-serif text-2xl font-bold text-[#2c1810] mb-2">Free</h3>
              <p className="text-[#5c3d2e]/70 mb-6">Everything you need to start journaling</p>
              <div className="text-4xl font-serif font-bold text-[#2c1810] mb-8">
                $0 <span className="text-lg font-normal text-[#8b7355]">forever</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited journal entries',
                  'Beautiful book aesthetic',
                  'Full customization',
                  'Mood tracking',
                  'Tags & bookmarks',
                  'Search & calendar',
                  'Writing prompts',
                  'PIN lock security',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#5c3d2e]">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-4 border-2 border-[#2c1810] text-[#2c1810] rounded-full font-medium hover:bg-[#2c1810] hover:text-white transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 bg-gradient-to-br from-[#2c1810] to-[#3d251a] rounded-3xl shadow-2xl text-white overflow-hidden"
            >
              {/* Gold accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a574]/20 rounded-full blur-3xl" />

              {/* Pro badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 bg-[#d4a574] text-[#2c1810] rounded-full text-sm font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                Pro
              </div>

              <h3 className="font-serif text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/70 mb-6">For the dedicated journaler</p>
              <div className="text-4xl font-serif font-bold mb-2">
                $7.99 <span className="text-lg font-normal text-white/60">/month</span>
              </div>
              <p className="text-sm text-white/50 mb-8">or $59/year • $149 lifetime</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white/90">
                  <Check className="w-5 h-5 text-[#d4a574] flex-shrink-0" />
                  Everything in Free, plus:
                </li>
                {proFeatures.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3 text-white/90">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#d4a574]">
                      {feature.icon}
                    </div>
                    <div>
                      <span className="font-medium">{feature.title}</span>
                      <p className="text-sm text-white/50">{feature.description}</p>
                    </div>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-white/90">
                  <Check className="w-5 h-5 text-[#d4a574] flex-shrink-0" />
                  Entry templates
                </li>
                <li className="flex items-center gap-3 text-white/90">
                  <Check className="w-5 h-5 text-[#d4a574] flex-shrink-0" />
                  PDF export
                </li>
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-4 bg-[#d4a574] text-[#2c1810] rounded-full font-medium hover:bg-[#e5b685] transition-colors"
              >
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </PageTurnSection>

      {/* Final CTA Section */}
      <PageTurnSection className="relative py-32 px-6 bg-[#faf8f3]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-6">
            Your story deserves a beautiful home
          </h2>
          <p className="text-xl text-[#5c3d2e]/70 mb-10">
            Join thousands of writers who've made Boundless their daily companion
          </p>
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-2 px-10 py-5 bg-[#f5f0e8] text-[#2c1810] font-medium text-lg transition-all hover:-translate-y-1"
            style={{
              boxShadow: '0 6px 20px -4px rgba(44, 24, 16, 0.2), 0 3px 8px -2px rgba(44, 24, 16, 0.15)',
              borderRadius: '4px',
              border: '1px solid rgba(44, 24, 16, 0.1)',
            }}
          >
            <span className="relative">Begin Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </PageTurnSection>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-[#2c1810]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2c1810] flex items-center justify-center">
              <span className="text-[#d4a574] font-serif font-bold text-sm">B</span>
            </div>
            <span className="font-serif text-lg font-bold text-[#2c1810]">Boundless</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#5c3d2e]/60">
            <Link href="/privacy" className="hover:text-[#2c1810] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2c1810] transition-colors">Terms</Link>
          </div>
          <p className="text-sm text-[#5c3d2e]/50">
            &copy; 2026 Boundless. Write without limits.
          </p>
        </div>
      </footer>
    </div>
  );
}
