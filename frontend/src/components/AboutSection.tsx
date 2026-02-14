
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Truck, Award, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  
  const features = [
    {
      icon: Shield,
      title: language === 'ar' ? 'جودة عالية' : 'High Quality',
      description: language === 'ar' ? 'أقمشة فاخرة وخياطة متقنة' : 'Luxury fabrics and perfect tailoring'
    },
    {
      icon: Truck,
      title: language === 'ar' ? 'توصيل سريع' : 'Fast Delivery',
      description: language === 'ar' ? 'توصيل مجاني لجميع أنحاء المملكة' : 'Free delivery across the Kingdom'
    },
    {
      icon: Award,
      title: language === 'ar' ? 'تصاميم حصرية' : 'Exclusive Designs',
      description: language === 'ar' ? 'تصاميم عصرية تناسب جميع الأذواق' : 'Modern designs for all tastes'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'خدمة عملاء متميزة' : 'Excellent Service',
      description: language === 'ar' ? 'فريق دعم متاح على مدار الساعة' : '24/7 customer support team'
    }
  ];
  
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {language === 'ar' ? 'لماذا نحن؟' : 'Why Choose Us?'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'ar' 
              ? 'نحن متخصصون في تقديم أفضل الأزياء الشرعية التي تجمع بين الأناقة والحشمة'
              : 'We specialize in providing the best modest fashion that combines elegance and modesty'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
