import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, ChevronDown, Feather, Star, ShieldCheck } from 'lucide-react';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  const scrollDown = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const badges = [
    { icon: Feather, key: 'hero.badge1', text: isRTL ? 'أقمشة فاخرة' : 'Premium Fabrics' },
    { icon: Star, key: 'hero.badge2', text: isRTL ? 'تصاميم حصرية' : 'Exclusive Designs' },
    { icon: ShieldCheck, key: 'hero.badge3', text: isRTL ? 'جودة مضمونة' : 'Guaranteed Quality' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-color)] pt-20"
    >
      {/* Background elegant accents */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[var(--primary-beige)]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] rounded-full bg-[var(--primary-beige)]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[var(--gold-accent)]/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-6 text-center animate-fade-up flex flex-col items-center justify-center h-full"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Collection Badge */}
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[var(--border-color)] text-[var(--soft-brown)] px-5 py-2 rounded-full text-xs font-bold mb-10 shadow-sm tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-accent)]" />
          <span>
            {isRTL ? '✦ مجموعة 2025 الحصرية ✦' : '✦ The 2025 Exclusive Collection ✦'}
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-black text-[var(--text-dark)] mb-8 leading-[1.15] tracking-tight max-w-4xl ${
            isRTL ? "font-['Cairo']" : "font-['Inter'] uppercase"
          }`}
        >
          {isRTL ? (
            <>
              <span className="block font-medium text-3xl md:text-5xl text-[var(--soft-brown)] mb-4">أناقة تعكس</span>
              <span className="block text-[var(--gold-accent)]">{t('site.tagline').split(' ').slice(-1)[0]}</span>
            </>
          ) : (
            <>
              <span className="block font-medium text-3xl md:text-5xl text-[var(--soft-brown)] mb-4 tracking-widest">Elegance That</span>
              <span className="block text-[var(--gold-accent)]">Reflects Your Values</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className={`text-[var(--soft-brown)] text-base md:text-lg max-w-2xl mx-auto mb-14 leading-relaxed opacity-90 ${isRTL ? "font-['Cairo']" : "font-['Inter'] font-light"}`}>
          {t('hero.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 w-full sm:w-auto">
          <button
            onClick={scrollDown}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-10 text-sm font-semibold tracking-widest uppercase transition-all duration-300 bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] shadow-lg hover:shadow-xl rounded-none"
          >
            {t('hero.cta')}
          </button>
          <button
            onClick={scrollDown}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-10 text-sm font-semibold tracking-widest uppercase transition-all duration-300 border border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--border-color)]/50 rounded-none bg-white"
          >
            {t('hero.cta2')}
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          {badges.map(({ icon: Icon, key, text }) => (
            <div key={key} className="flex items-center gap-2 text-[var(--soft-brown)] px-4 py-2 text-sm font-medium">
              <Icon className="w-4 h-4 text-[var(--gold-accent)]" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--soft-brown)]/50 hover:text-[var(--soft-brown)] transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
};

export default Hero;
