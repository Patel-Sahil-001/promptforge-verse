import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1014] text-white flex flex-col items-center justify-center p-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          <div className="max-w-3xl w-full bg-[#1A1112] border border-[#e8192c]/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(232,25,44,0.15)] relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#e8192c]/10 rounded-xl">
                <AlertCircle className="w-8 h-8 text-[#e8192c]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">Critical Error Detected</h1>
            </div>
            
            <p className="text-white/60 mb-8 font-mono text-sm leading-[1.8]">
              A runtime exception caused the application to crash. This could be caused by hardware acceleration issues, a failing script load, or an adblocker preventing critical dependencies from being fetched. Please share the error output below.
            </p>

            <div className="bg-black/80 rounded-xl p-5 overflow-auto border border-white/5 mb-8 max-h-[300px] shadow-inner">
              <h2 className="text-[#e8192c]/80 font-mono text-xs mb-3 uppercase tracking-widest font-bold">Error Output:</h2>
              <pre className="text-white/80 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {this.state.error?.toString()}
                {'\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#e8192c] hover:bg-[#ff1e1e] text-white font-bold tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(232,25,44,0.4)] hover:shadow-[0_6px_30px_rgba(232,25,44,0.6)] uppercase hover:-translate-y-1"
            >
              Reboot Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
