import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      toast({ title: isRTL ? 'أهلاً بكِ مجدداً في مُسلمة ✓' : 'Welcome back to Muslima ✓' });
      navigate('/');
    } else {
      toast({ title: isRTL ? 'خطأ في الدخول' : 'Login failed', description: res.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left: Image Panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--text-dark)]">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80)' }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center z-10">
          <div className="w-20 h-20 border border-[var(--gold-accent)] flex items-center justify-center mb-8">
            <span className={`text-4xl font-bold text-[var(--gold-accent)] ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>م</span>
          </div>
          <h1 className={`text-5xl font-bold mb-6 tracking-widest uppercase text-white ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
            {t('site.name')}
          </h1>
          <p className="text-white/60 text-lg font-light tracking-widest uppercase max-w-sm">{t('site.tagline')}</p>
          <div className="mt-16 flex flex-col gap-4 text-xs font-semibold tracking-widest uppercase text-[var(--primary-beige)]">
            {['شحن مجاني فوق 1000 ج.م', 'إرجاع مجاني خلال 14 يوم', 'جودة مضمونة 100%'].map((f, idx) => (
              <p key={idx} className="flex items-center gap-2 justify-center"><span className="text-[var(--gold-accent)]">✦</span> {f}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-color)] px-6 py-12 relative">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className={`text-3xl font-bold text-[var(--text-dark)] tracking-widest uppercase ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('site.name')}
            </Link>
          </div>

          <div className="bg-white p-8 md:p-12 border border-[var(--border-color)]">
            <h2 className={`text-3xl font-bold text-[var(--text-dark)] mb-3 tracking-widest uppercase ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('auth.login')}
            </h2>
            <p className="text-[var(--soft-brown)]/60 text-xs font-semibold uppercase tracking-widest mb-10">{t('auth.welcome')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[var(--text-dark)] text-xs font-semibold uppercase tracking-widest mb-3">{t('auth.email')}</label>
                <input type="email" required placeholder="email@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent border border-[var(--border-color)] focus:border-[var(--gold-accent)] outline-none text-[var(--text-dark)] placeholder-[var(--soft-brown)]/30 transition-colors font-['Inter']"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-[var(--text-dark)] text-xs font-semibold uppercase tracking-widest mb-3">{t('auth.password')}</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full h-14 px-4 bg-transparent border border-[var(--border-color)] focus:border-[var(--gold-accent)] outline-none text-[var(--text-dark)] placeholder-[var(--soft-brown)]/30 transition-colors font-['Inter'] pe-12"
                    dir="ltr"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 end-4 flex items-center text-[var(--soft-brown)]/50 hover:text-[var(--gold-accent)] transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-16 bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] font-semibold text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-3 disabled:opacity-50 mt-4">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><LogIn className="w-5 h-5" />{t('auth.loginBtn')}</>
                }
              </button>
            </form>

            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--soft-brown)]/60 mt-8">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-[var(--text-dark)] hover:text-[var(--gold-accent)] transition-colors underline">{t('nav.register')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;