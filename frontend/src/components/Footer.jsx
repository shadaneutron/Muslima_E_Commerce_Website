import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-[var(--text-dark)] text-white relative overflow-hidden">
      {/* Top subtle border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)]/30 to-transparent" />

      {/* Newsletter strip */}
      <div className="border-b border-white/10 py-12 bg-white/5">
        <div className="container mx-auto px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="text-center md:text-start">
              <p className={`font-semibold text-xl tracking-widest uppercase text-[var(--primary-beige)] mb-2 ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
                {t('footer.newsletter')}
              </p>
              <p className="text-white/60 text-sm font-light">{t('footer.tagline')}</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-transparent border-b border-white/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--gold-accent)] w-full md:w-72 transition-colors rounded-none"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button className="bg-[var(--gold-accent)] text-[var(--text-dark)] font-bold px-6 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-white ml-2 rounded-none">
                {t('footer.newsletterBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 lg:px-8 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="text-center md:text-start">
            <h3 className={`text-3xl font-black mb-6 text-white tracking-widest uppercase ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('site.name')}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed font-light mb-8 max-w-sm mx-auto md:mx-0">
              {t('footer.about')}
            </p>
            {/* Secure badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {['SSL SECURED', 'PREMIUM QUALITY', 'FAST SHIPPING'].map(b => (
                <span key={b} className="text-[10px] tracking-widest uppercase border border-white/20 text-white/50 px-3 py-1">{b}</span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-start">
            <h4 className={`font-semibold text-[var(--primary-beige)] mb-8 text-sm uppercase tracking-widest ${isRTL ? "font-['Cairo']" : ''}`}>
              {t('footer.links')}
            </h4>
            <nav className="space-y-4">
              {[
                { label: t('cat.abayas'), to: '/#product-grid' },
                { label: t('cat.hijabs'),  to: '/#product-grid' },
                { label: t('cat.skirts'),  to: '/#product-grid' },
                { label: t('nav.wishlist'), to: '/wishlist' },
                { label: t('nav.login'),   to: '/login' },
              ].map(({ label, to }) => (
                <Link key={label} to={to} className="block text-white/60 hover:text-[var(--gold-accent)] text-sm tracking-wide transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Socials */}
          <div className="text-center md:text-start">
            <h4 className={`font-semibold text-[var(--primary-beige)] mb-8 text-sm uppercase tracking-widest ${isRTL ? "font-['Cairo']" : ''}`}>
              {t('footer.contact')}
            </h4>
            <div className="space-y-4 text-sm text-white/60 font-light inline-block text-start">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--gold-accent)]" />
                <span className="tracking-widest">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--gold-accent)]" />
                <span className="tracking-wider">{t('footer.email')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--gold-accent)]" />
                <span className="tracking-wider">{isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-10">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-[var(--text-dark)] hover:bg-[var(--gold-accent)] hover:border-[var(--gold-accent)] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs tracking-widest uppercase font-light">
          <p>{t('footer.rights')}</p>
          <p>{isRTL ? 'صُنع بـ ❤ في مصر' : 'Made with ❤ in Egypt'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
