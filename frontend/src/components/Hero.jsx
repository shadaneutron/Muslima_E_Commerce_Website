import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const FallbackImg = '/products/placeholder.svg';

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section id="home" className="relative bg-gradient-to-r from-stone-50 to-amber-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-start">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6 leading-tight">
              {t('hero.title')}
            </h2>
            <p className="text-lg text-stone-600 mb-8">
              {t('hero.subtitle')}
            </p>
            <Button 
              onClick={scrollToProducts}
              size="lg"
              className="bg-stone-600 hover:bg-stone-700 text-white px-8 py-3 rounded-lg text-lg"
            >
              {t('hero.cta')}
            </Button>
          </div>
          
          <div className="relative">
            <img 
              src="/products/81e3f46c-c361-4e65-83d0-f37189b95335.jpg" 
              alt="Modest Fashion"
              className="rounded-lg shadow-2xl w-full h-96 object-cover"
              onError={(e) => { e.currentTarget.src = FallbackImg; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
