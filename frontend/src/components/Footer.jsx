import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer id="contact" className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('site.name')}</h3>
            <p className="text-gray-400">{t('footer.about')}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="h-4 w-4" />
                <span className="text-gray-400">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="h-4 w-4" />
                <span className="text-gray-400">{t('footer.email')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.follow')}</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
