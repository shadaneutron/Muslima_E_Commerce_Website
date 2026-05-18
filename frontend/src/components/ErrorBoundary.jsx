import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] px-4"
          dir="rtl"
        >
          <div className="text-center max-w-md">
            {/* Decorative glow */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(180,83,9,0.25)]">
              <span className="text-4xl">✦</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#451A03] mb-3 font-['Tajawal']">
              حدث خطأ غير متوقع
            </h1>
            <p className="text-[#78350F] mb-6 leading-relaxed">
              نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-left text-xs bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 overflow-auto mb-6 max-h-32">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(180,83,9,0.3)]"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
