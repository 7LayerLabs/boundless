'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Shield, Sparkles, BookOpen, Heart, Calendar, Search, Tag, Monitor, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Two-Layer Security',
      description: 'Email authentication plus a personal PIN code keeps your journal completely private. No one gets in without both.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'End-to-End Privacy',
      description: 'Your thoughts stay yours. We built Boundless for people who want to write honestly without worrying about prying eyes.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Daily Prompts',
      description: 'Stuck staring at a blank page? Daily prompts spark reflection and help you dig deeper into your thoughts.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns over time. See how you feel day to day and notice trends in your mental state.',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Distraction-Free Writing',
      description: 'A clean, minimal interface that feels personal instead of clinical. Just you and your words.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Calendar View',
      description: 'Browse your entries by date. See your writing history at a glance and revisit any day.',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Powerful Search',
      description: 'Find any entry instantly. Search through all your journal entries to rediscover past thoughts.',
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: 'Tags & Organization',
      description: 'Organize entries with tags. Group related thoughts and find them easily later.',
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Sync Across Devices',
      description: 'Use Boundless on your computer, phone, or tablet. Your journal syncs automatically so your entries are always with you.',
    },
    {
      icon: <LockKeyhole className="w-6 h-6" />,
      title: 'Accountability Mode',
      description: 'Lock in your entries so they can\'t be erased. Add updates, but never lose your original thoughts. Your emotions matter — this helps you honor them instead of hiding from them.',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a1714 0%, #0d0b0a 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-amber-200/60 hover:text-amber-200/90 transition-colors mb-12 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Journal</span>
          </motion.div>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1
            className="text-4xl md:text-5xl font-serif tracking-wide mb-4"
            style={{ color: 'rgba(240, 220, 180, 0.9)' }}
          >
            Boundless
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(180, 170, 150, 0.7)' }}
          >
            A private digital journal for people who want to write honestly.
            Your thoughts deserve a space that&apos;s secure, personal, and distraction-free.
          </p>
        </motion.div>

        {/* Main description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 p-8 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'rgba(200, 190, 170, 0.8)' }}
          >
            Boundless is for people who want to write honestly and privately. The app uses layered
            access security with a two-step entry system to keep your journal locked down. Once inside,
            you get tools that make writing easier and more meaningful — daily prompts to spark reflection,
            a mood tracker to follow your emotional patterns, and a clean distraction-free writing space
            that feels personal instead of clinical.
          </p>
          <p
            className="text-base md:text-lg leading-relaxed mt-4"
            style={{ color: 'rgba(200, 190, 170, 0.8)' }}
          >
            The end goal is a private mental space where you can unload thoughts, track growth,
            and build self-awareness without worrying about someone else reading it.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className="text-2xl font-serif mb-8 text-center"
            style={{ color: 'rgba(212, 175, 55, 0.8)' }}
          >
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-6 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="mb-3"
                  style={{ color: 'rgba(212, 175, 55, 0.7)' }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: 'rgba(240, 220, 180, 0.9)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(180, 170, 150, 0.7)' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link href="/">
            <button
              className="px-8 py-3 rounded-lg text-base font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.15) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'rgba(212, 175, 55, 0.9)',
              }}
            >
              Start Writing
            </button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pt-8 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(160, 140, 120, 0.4)' }}
          >
            Boundless — Write without limits
          </p>
        </motion.div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}
