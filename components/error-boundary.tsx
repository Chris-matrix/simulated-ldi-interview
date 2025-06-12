'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showNavigation?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50">
          {this.props.showNavigation && (
            <header className="border-b bg-white">
              <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-lg font-semibold">
                  Interview Simulator
                </Link>
                <div className="flex space-x-4">
                  <Link href="/" className="hover:text-blue-600">Home</Link>
                  <Link href="/resume" className="hover:text-blue-600">Resume</Link>
                </div>
              </div>
            </header>
          )}
          
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
              <div className="mb-6 p-4 bg-red-50 rounded">
                <p className="text-red-700 font-medium">{this.state.error?.message || 'An unexpected error occurred'}</p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-2 text-sm text-gray-600">
                    <summary>View error details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Try again
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 text-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Go to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
