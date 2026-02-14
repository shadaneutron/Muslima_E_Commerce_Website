import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, Globe, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = ({ onCartClick, onMenuClick }) => {
  const { t, language, setLanguage } = useLanguage();
  const { items } = useCart();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };
  
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-amber-900">
              {language === 'ar' ? 'مُسلمة' : 'Muslima'}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              {t('nav.products')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              {t('nav.about')}
            </button>
            <a 
              href="/admin"
              className="flex items-center text-amber-700 hover:text-amber-900 transition-colors"
            >
              <Settings className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'لوحة التحكم' : 'Admin'}
            </a>
          </nav>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onCartClick}
              className="relative border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onMenuClick}
              className="md:hidden border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
