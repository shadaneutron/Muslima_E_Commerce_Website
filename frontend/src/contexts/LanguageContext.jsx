import React, { createContext, useContext, useState } from 'react';

const translations = {
  ar: {
    'site.name': 'مُسلمة',
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cart': 'السلة',
    'nav.language': 'EN',
    'hero.title': 'مجموعة مُسلمة للأزياء الشرعية',
    'hero.subtitle': 'اكتشفي عالماً من الأناقة والحشمة مع مجموعتنا المميزة من العباءات والجلابيب',
    'hero.cta': 'تسوقي الآن',
    'products.title': 'منتجاتنا',
    'products.all': 'جميع المنتجات',
    'products.abayas': 'عباءات',
    'products.jilbabs': 'جلابيب',
    'products.hijabs': 'حجابات',
    'products.price': 'ريال',
    'products.addToCart': 'أضف للسلة',
    'products.outOfStock': 'غير متوفر',
    'products.size': 'المقاس',
    'products.color': 'اللون',
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الطلب',
    'cart.quantity': 'الكمية',
    'cart.remove': 'حذف',
    'checkout.title': 'إتمام الطلب',
    'checkout.customerInfo': 'بيانات العميل',
    'checkout.name': 'الاسم الكامل',
    'checkout.email': 'البريد الإلكتروني',
    'checkout.phone': 'رقم الهاتف',
    'checkout.address': 'العنوان',
    'checkout.city': 'المدينة',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.bankTransfer': 'تحويل بنكي',
    'checkout.visa': 'فيزا/ماستركارد',
    'checkout.cod': 'دفع عند الاستلام',
    'checkout.placeOrder': 'تأكيد الطلب',
    'footer.about': 'متجر مُسلمة متخصص في الأزياء الشرعية العصرية',
    'footer.contact': 'معلومات التواصل',
    'footer.phone': 'الهاتف: +966 XX XXX XXXX',
    'footer.email': 'البريد: info@muslima.com',
    'footer.follow': 'تابعونا',
    'footer.rights': 'جميع الحقوق محفوظة © 2024 مُسلمة',
  },
  en: {
    'site.name': 'Muslima',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.language': 'عر',
    'hero.title': 'Muslima Modest Fashion Collection',
    'hero.subtitle': 'Discover a world of elegance and modesty with our exclusive collection of abayas and jilbabs',
    'hero.cta': 'Shop Now',
    'products.title': 'Our Products',
    'products.all': 'All Products',
    'products.abayas': 'Abayas',
    'products.jilbabs': 'Jilbabs',
    'products.hijabs': 'Hijabs',
    'products.price': 'SAR',
    'products.addToCart': 'Add to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.size': 'Size',
    'products.color': 'Color',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    'checkout.title': 'Checkout',
    'checkout.customerInfo': 'Customer Information',
    'checkout.name': 'Full Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.bankTransfer': 'Bank Transfer',
    'checkout.visa': 'Visa/Mastercard',
    'checkout.cod': 'Cash on Delivery',
    'checkout.placeOrder': 'Place Order',
    'footer.about': 'Muslima store specializes in modern modest fashion',
    'footer.contact': 'Contact Information',
    'footer.phone': 'Phone: +966 XX XXX XXXX',
    'footer.email': 'Email: info@muslima.com',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All Rights Reserved © 2024 Muslima',
  },
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');

  const t = (key) => {
    return (translations[language] && translations[language][key]) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
