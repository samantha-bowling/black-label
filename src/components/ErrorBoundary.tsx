
import React, { Component, ReactNode } from 'react';
import { CardLuxe, HeadingLG, ButtonPrimary } from '@/components/ui/primitives';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <CardLuxe className="p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <HeadingLG className="text-white mb-4">
              Something went wrong
            </HeadingLG>
            <p className="text-white/70 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <ButtonPrimary 
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </ButtonPrimary>
          </CardLuxe>
        </div>
      );
    }

    return this.props.children;
  }
}
