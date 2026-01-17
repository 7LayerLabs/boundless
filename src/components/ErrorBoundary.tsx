'use client';

import { Component, type ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  description?: string;
}

/**
 * A customizable fallback UI component for error states.
 * Use this for simpler, inline error displays or when you want
 * to customize the error UI in specific sections.
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left w-full max-w-md">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            Error details (development only)
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto max-h-32">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  title?: string;
  description?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A React Error Boundary component that catches JavaScript errors
 * in its child component tree and displays a fallback UI.
 *
 * Error boundaries must be class components in React.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <SomeComponent />
 * </ErrorBoundary>
 *
 * // With custom title/description
 * <ErrorBoundary
 *   title="Oops!"
 *   description="We couldn't load this section."
 * >
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render the default ErrorFallback
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          title={this.props.title}
          description={this.props.description}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * A styled error fallback specifically designed for the journal page context.
 * Uses the app's amber/gold color scheme and journal aesthetic.
 */
export function JournalErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.2)',
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.2) 100%)',
          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)',
        }}
      >
        <AlertCircle className="w-8 h-8 text-amber-600" />
      </div>

      <h3
        className="text-xl font-serif tracking-wide mb-3"
        style={{ color: 'rgba(120, 53, 15, 0.9)' }}
      >
        A small bump in the road
      </h3>

      <p
        className="text-sm mb-6 max-w-md leading-relaxed"
        style={{ color: 'rgba(146, 64, 14, 0.7)' }}
      >
        Something unexpected happened while loading this section.
        Your journal entries are safe. Let&apos;s try that again.
      </p>

      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium"
        style={{
          background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
        }}
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left w-full max-w-lg">
          <summary className="text-xs cursor-pointer hover:underline" style={{ color: 'rgba(146, 64, 14, 0.5)' }}>
            Technical details (development only)
          </summary>
          <pre
            className="mt-2 p-4 rounded-lg text-xs overflow-auto max-h-40"
            style={{
              background: 'rgba(0, 0, 0, 0.03)',
              color: 'rgba(120, 53, 15, 0.7)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            }}
          >
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * A minimal error fallback for smaller UI sections like modals or widgets.
 */
export function CompactErrorFallback({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600" />
      </div>
      <p className="text-sm text-gray-600 mb-3">Something went wrong</p>
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    </div>
  );
}
