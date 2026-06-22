import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
          <h1 className="text-4xl font-heading mb-4 text-red-600">Terjadi Kesalahan</h1>
          <p className="text-secondary mb-8 max-w-md">
            Aplikasi mengalami kendala teknis. Data Anda di browser tetap aman.
          </p>
          <div className="bg-surface-container p-6 border border-primary mb-8 w-full max-w-lg text-left overflow-auto max-h-64">
            <p className="font-mono text-xs text-red-700">{this.state.error?.toString()}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-8 py-3 uppercase tracking-widest font-bold"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
