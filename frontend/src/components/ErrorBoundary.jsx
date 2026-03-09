import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-300 mb-6">
              We're sorry for the inconvenience. The error has been logged and we'll look into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left overflow-auto max-h-48">
                <p className="text-red-400 text-sm font-mono break-word">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-gray-500 text-xs mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
