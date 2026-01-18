'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
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
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Playfair Display is loaded via CSS variable --font-playfair
const serifFont = 'var(--font-playfair), Georgia, serif';

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Beautiful Book Aesthetic',
      description: 'Write in a realistic leather-bound journal with customizable bindings, pages, and clasps.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Private & Secure',
      description: 'Your thoughts are protected with optional PIN lock and encrypted storage.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Fully Customizable',
      description: 'Choose fonts, colors, themes, and backgrounds. Make it truly yours.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Daily Journaling',
      description: 'Navigate by date, search entries, and track your writing journey.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Mood Tracking',
      description: 'Log your emotions and visualize patterns over time.',
    },
    {
      icon: <Feather className="w-6 h-6" />,
      title: 'Writing Prompts',
      description: 'Never face a blank page. Get inspired with thoughtful prompts.',
    },
  ];

  const proFeatures = [
    {
      icon: <Compass className="w-5 h-5" />,
      title: 'Guided Programs',
      description: '30-day journeys for life stories, relationships, goals & more',
    },
    {
      icon: <Quote className="w-5 h-5" />,
      title: 'Daily Quotes',
      description: 'Curated inspiration to start your writing',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Reflections',
      description: 'Thoughtful questions based on your writing',
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
            className="px-5 py-2.5 bg-[#2c1810] text-[#faf8f3] rounded-full font-medium text-sm hover:bg-[#3d251a] transition-colors shadow-md"
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c1810]/5 rounded-full mb-8 border border-[#2c1810]/10"
          >
            <Feather className="w-4 h-4 text-[#8b4513]" />
            <span className="text-sm font-medium text-[#5c3d2e]">Your private sanctuary for reflection</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[#2c1810] leading-[0.95] tracking-tight mb-6"
          >
            Write Without
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Limits</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-2 left-0 right-0 h-4 bg-[#d4a574]/30 -z-0 origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-[#5c3d2e]/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A beautiful digital journal that feels like the real thing.
            Private, customizable, and designed for meaningful reflection.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 px-8 py-4 bg-[#2c1810] text-[#faf8f3] rounded-full font-medium text-lg hover:bg-[#3d251a] transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Start Your Journal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              {/* Shadow/glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#8b4513]/20 to-transparent blur-3xl transform translate-y-10" />

              {/* Journal mockup */}
              <div
                className="relative bg-gradient-to-br from-[#5c3a21] via-[#4a2f1a] to-[#3d251a] rounded-2xl p-1 shadow-2xl"
                style={{
                  boxShadow: '0 25px 80px -20px rgba(44, 24, 16, 0.5), 0 10px 30px -10px rgba(44, 24, 16, 0.3)',
                }}
              >
                {/* Leather texture */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Gold clasp */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-16 h-6 bg-gradient-to-b from-[#d4a574] to-[#b8956a] rounded-b-lg shadow-lg z-10" />

                {/* Inner page */}
                <div className="relative bg-[#faf8f3] rounded-xl p-8 md:p-12 min-h-[400px]">
                  {/* Page lines */}
                  <div
                    className="absolute inset-8 md:inset-12 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #b4a08c 31px, #b4a08c 32px)',
                    }}
                  />

                  {/* Content preview */}
                  <div className="relative">
                    <p className="text-[#8b7355] text-sm mb-2 font-medium">JANUARY 18, 2026</p>
                    <p className="font-serif text-2xl md:text-3xl text-[#2c1810] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      Today I realized that the small moments are the ones worth remembering...
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <span className="text-2xl">😊</span>
                      <span className="px-3 py-1 bg-[#d4a574]/20 text-[#8b4513] rounded-full text-sm">#grateful</span>
                      <span className="px-3 py-1 bg-[#d4a574]/20 text-[#8b4513] rounded-full text-sm">#reflection</span>
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

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-4">
              Everything you need to write
            </h2>
            <p className="text-lg text-[#5c3d2e]/70 max-w-xl mx-auto">
              A thoughtfully designed space for your daily reflections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#2c1810]/5 hover:border-[#d4a574]/30 hover:bg-white/80 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-[#2c1810]/5 rounded-xl flex items-center justify-center text-[#8b4513] mb-5 group-hover:bg-[#d4a574]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#2c1810] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#5c3d2e]/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Programs Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-[#2c1810] to-[#3d251a] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4a574]/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a574]/20 rounded-full mb-6">
              <Star className="w-4 h-4 text-[#d4a574] fill-current" />
              <span className="text-sm font-medium text-[#d4a574]">Pro Feature</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              14 Guided Journaling Programs
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Structured journeys to help you explore your life story, build better relationships, achieve goals, and grow as a person
            </p>
          </motion.div>

          {/* Program Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                category: 'Wellness & Growth',
                emoji: '🌱',
                programs: ['30 Days of Gratitude', 'Self-Discovery Journey', '21 Days of Mindfulness', '14 Days to Confidence'],
                color: 'from-amber-500/20 to-amber-600/10',
              },
              {
                category: 'My Story & Legacy',
                emoji: '📖',
                programs: ['My Life Story', 'Letters to Loved Ones', 'Family History Project'],
                color: 'from-pink-500/20 to-pink-600/10',
              },
              {
                category: 'Business & Dreams',
                emoji: '✨',
                programs: ['Business Builder', 'Dream Life Blueprint', '30-Day Goal Crusher'],
                color: 'from-blue-500/20 to-blue-600/10',
              },
              {
                category: 'Relationships',
                emoji: '💕',
                programs: ['Marriage & Partnership', 'Parenting Reflections', 'Healing Relationships', 'Friendship Circle'],
                color: 'from-rose-500/20 to-rose-600/10',
              },
            ].map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/10 backdrop-blur-sm`}
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3">
                  {cat.category}
                </h3>
                <ul className="space-y-2">
                  {cat.programs.map((program) => (
                    <li key={program} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4a574]" />
                      {program}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Sample prompts preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <p className="text-sm text-[#d4a574] font-medium mb-4">SAMPLE PROMPTS FROM "MY LIFE STORY"</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { day: 'Day 1', prompt: 'Describe your earliest childhood memory. What do you see, hear, and feel?' },
                { day: 'Day 15', prompt: 'Write about a teacher or mentor who shaped who you became.' },
                { day: 'Day 30', prompt: 'If you could write a letter to your younger self, what would you say?' },
              ].map((item) => (
                <div key={item.day} className="text-white/80">
                  <span className="text-xs text-[#d4a574] font-medium">{item.day}</span>
                  <p className="mt-1 text-sm leading-relaxed italic">"{item.prompt}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-[#2c1810]/5 to-transparent">
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

              {/* Popular badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 bg-[#d4a574] text-[#2c1810] rounded-full text-sm font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                Popular
              </div>

              <h3 className="font-serif text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/70 mb-6">For the dedicated journaler</p>
              <div className="text-4xl font-serif font-bold mb-2">
                $6 <span className="text-lg font-normal text-white/60">/month</span>
              </div>
              <p className="text-sm text-white/50 mb-8">or $49 lifetime</p>

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
                className="w-full py-4 bg-[#d4a574] text-[#2c1810] rounded-full font-medium hover:bg-[#e0b485] transition-colors"
              >
                Start Free Trial
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-6">
            Your story deserves a beautiful home
          </h2>
          <p className="text-xl text-[#5c3d2e]/70 mb-10">
            Join thousands of writers who've made Boundless their daily companion
          </p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 px-10 py-5 bg-[#2c1810] text-[#faf8f3] rounded-full font-medium text-lg hover:bg-[#3d251a] transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

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
