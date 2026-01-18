'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { DeskScene } from '@/components/scene/DeskScene';
import { ProgramBook } from '@/components/program/ProgramBook';
import { ErrorBoundary, JournalErrorFallback } from '@/components/ErrorBoundary';
import { db } from '@/lib/db/instant';
import { guidedPrograms } from '@/constants/programs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoading: authLoading, user } = db.useAuth();

  // Find the program
  const program = guidedPrograms.find(p => p.id === id);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/');
    return null;
  }

  // Show 404 if program not found
  if (!program) {
    return (
      <DeskScene>
        <div className="text-center p-8 bg-amber-50/90 rounded-2xl shadow-xl">
          <p className="text-neutral-800 mb-4">Program not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </DeskScene>
    );
  }

  return (
    <DeskScene>
      {/* Loading spinner */}
      {authLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full"
          />
        </motion.div>
      )}

      {/* Program Book */}
      {user && (
        <ErrorBoundary
          fallback={
            <div className="w-full max-w-2xl mx-auto mt-8">
              <JournalErrorFallback
                error={new Error('An error occurred')}
                resetErrorBoundary={() => window.location.reload()}
              />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="program-book"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto"
            >
              <ProgramBook program={program} onClose={() => router.push('/')} />
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      )}
    </DeskScene>
  );
}
