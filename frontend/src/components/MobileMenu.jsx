import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900 text-center">
            {t('nav.menu')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <Button
            variant="ghost"
            onClick={() => scrollToSection('home')}
            className="text-amber-700 hover:bg-amber-100 justify-start"
          >
            {t('nav.home')}
          </Button>

          <Button
            variant="ghost"
            onClick={() => scrollToSection('products')}
            className="text-amber-700 hover:bg-amber-100 justify-start"
          >
            {t('nav.products')}
          </Button>

          <Button
            variant="ghost"
            onClick={() => scrollToSection('about')}
            className="text-amber-700 hover:bg-amber-100 justify-start"
          >
            {t('nav.about')}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = '/admin';
              onClose();
            }}
            className="text-amber-700 hover:bg-amber-100 justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'لوحة التحكم' : 'Admin'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileMenu;
