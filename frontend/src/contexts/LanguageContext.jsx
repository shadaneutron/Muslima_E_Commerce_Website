import React, { createContext, useContext, useState } from 'react';

const translations = {
  ar: {
    // Site
    'site.name': 'مُسلمة',
    'site.tagline': 'أناقة تعكس قيمكِ',
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cart': 'السلة',
    'nav.wishlist': 'المفضلة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'خروج',
    'nav.register': 'إنشاء حساب',
    'nav.language': 'EN',
    'nav.admin': 'لوحة التحكم',
    // Announcement bar
    'announce.shipping': 'شحن مجاني للطلبات فوق 1000 ج.م',
    'announce.returns': 'إرجاع مجاني خلال 14 يوم',
    // Hero
    'hero.title': 'مجموعة مُسلمة للأزياء الراقية',
    'hero.subtitle': 'اكتشفي عالماً من الأناقة والحشمة — عباءات خليجية، حجاب عصري، جيبات راقية.',
    'hero.cta': 'تسوقي الآن',
    'hero.cta2': 'استعرضي المجموعة',
    'hero.badge1': 'شحن سريع',
    'hero.badge2': 'جودة عالية',
    'hero.badge3': 'إرجاع مجاني',
    // Categories
    'cat.all': 'الكل',
    'cat.abayas': 'عباءات خليجي',
    'cat.hijabs': 'حجاب عصري',
    'cat.skirts': 'جيبات راقية',
    // Products
    'products.title': 'تشكيلتنا الحصرية',
    'products.subtitle': '15 قطعة فاخرة مختارة بعناية من أجلكِ',
    'products.currency': 'ج.م',
    'products.addToCart': 'أضف للسلة',
    'products.outOfStock': 'غير متوفر',
    'products.details': 'التفاصيل',
    'products.wishlist.add': 'أضف للمفضلة',
    'products.wishlist.remove': 'أزل من المفضلة',
    'products.freeShipping': 'شحن مجاني',
    'products.lowStock': 'متبقي {count} قطع فقط!',
    'products.inStock': 'متوفر',
    'products.loading': 'جاري تحميل المنتجات...',
    'products.empty': 'لا توجد منتجات في هذه الفئة',
    // Product Detail
    'detail.back': 'رجوع',
    'detail.category': 'التصنيف',
    'detail.addToCart': 'أضف للسلة',
    'detail.outOfStock': 'غير متوفر',
    'detail.wishlist': 'حفظ في المفضلة',
    'detail.wishlisted': 'في المفضلة ❤',
    'detail.zoom': 'حرّكي الفأرة للتكبير',
    'detail.loginRequired': 'سجلي دخولك لحفظ المفضلة',
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتكِ فارغة',
    'cart.emptyHint': 'أضيفي منتجات رائعة لتبدأ التسوق',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب',
    'cart.quantity': 'الكمية',
    'cart.remove': 'حذف',
    'cart.shipping.free': 'مبروك! شحنك مجاني',
    'cart.shipping.progress': 'أضيفي {amount} ج.م للحصول على شحن مجاني',
    'cart.shipping.cost': 'رسوم الشحن',
    'cart.subtotal': 'المجموع الفرعي',
    // Checkout
    'checkout.step1': 'مراجعة السلة',
    'checkout.step2': 'بيانات الشحن',
    'checkout.step3': 'تأكيد الطلب',
    'checkout.address': 'العنوان',
    'checkout.city': 'المدينة',
    'checkout.placeOrder': 'تأكيد الطلب',
    'checkout.back': 'رجوع',
    'checkout.next': 'متابعة',
    'checkout.loginRequired': 'يجب تسجيل الدخول لإتمام الطلب',
    'checkout.success': 'تم تأكيد طلبكِ بنجاح!',
    'checkout.successHint': 'سنتواصل معكِ قريباً لتأكيد الشحن',
    // Wishlist
    'wishlist.title': 'قائمة المفضلة',
    'wishlist.empty': 'قائمة المفضلة فارغة',
    'wishlist.emptyHint': 'احفظي المنتجات التي تعجبكِ لتجديها هنا',
    'wishlist.remove': 'إزالة',
    'wishlist.loginRequired': 'سجلي دخولك لعرض مفضلتكِ',
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب جديد',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.loginBtn': 'دخول',
    'auth.registerBtn': 'إنشاء الحساب',
    'auth.haveAccount': 'لديكِ حساب؟',
    'auth.noAccount': 'ليس لديكِ حساب؟',
    'auth.welcome': 'أهلاً بكِ مجدداً',
    // Common
    'common.back': 'رجوع',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ، حاولي مرة أخرى',
    'common.retry': 'إعادة المحاولة',
    'common.hi': 'أهلاً',
    // Footer
    'footer.tagline': 'أناقة تعكس قيمكِ',
    'footer.about': 'متجر مُسلمة متخصص في الأزياء العصرية المحتشمة للمرأة المسلمة.',
    'footer.contact': 'تواصلي معنا',
    'footer.phone': '+20 100 000 0000',
    'footer.email': 'info@muslima.boutique',
    'footer.follow': 'تابعينا',
    'footer.links': 'روابط سريعة',
    'footer.rights': '© 2025 مُسلمة — جميع الحقوق محفوظة',
    'footer.newsletter': 'اشتركي في نشرتنا البريدية',
    'footer.newsletterBtn': 'اشتراك',
    'footer.newsletterPlaceholder': 'بريدك الإلكتروني',
  },
  en: {
    // Site
    'site.name': 'Muslima',
    'site.tagline': 'Elegance that reflects your values',
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Collection',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.register': 'Create Account',
    'nav.language': 'عر',
    'nav.admin': 'Dashboard',
    // Announcement bar
    'announce.shipping': 'Free Shipping on orders over 1000 EGP',
    'announce.returns': 'Free returns within 14 days',
    // Hero
    'hero.title': 'Muslima Premium Modest Fashion',
    'hero.subtitle': 'Discover a world of elegance — Khaleeji Abayas, Modern Hijabs, Elegant Skirts.',
    'hero.cta': 'Shop Now',
    'hero.cta2': 'View Collection',
    'hero.badge1': 'Fast Shipping',
    'hero.badge2': 'Premium Quality',
    'hero.badge3': 'Free Returns',
    // Categories
    'cat.all': 'All',
    'cat.abayas': 'Khaleeji Abayas',
    'cat.hijabs': 'Modern Hijabs',
    'cat.skirts': 'Elegant Skirts',
    // Products
    'products.title': 'Our Exclusive Collection',
    'products.subtitle': '15 luxury pieces curated exclusively for you',
    'products.currency': 'EGP',
    'products.addToCart': 'Add to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.details': 'Details',
    'products.wishlist.add': 'Save to Wishlist',
    'products.wishlist.remove': 'Remove from Wishlist',
    'products.freeShipping': 'Free Shipping',
    'products.lowStock': 'Only {count} left!',
    'products.inStock': 'In Stock',
    'products.loading': 'Loading products...',
    'products.empty': 'No products in this category',
    // Product Detail
    'detail.back': 'Back',
    'detail.category': 'Category',
    'detail.addToCart': 'Add to Cart',
    'detail.outOfStock': 'Out of Stock',
    'detail.wishlist': 'Save to Wishlist',
    'detail.wishlisted': 'Wishlisted ❤',
    'detail.zoom': 'Hover to zoom',
    'detail.loginRequired': 'Sign in to save to wishlist',
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyHint': 'Add beautiful products to get started',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Qty',
    'cart.remove': 'Remove',
    'cart.shipping.free': 'You have free shipping!',
    'cart.shipping.progress': 'Add {amount} EGP more for free shipping',
    'cart.shipping.cost': 'Shipping',
    'cart.subtotal': 'Subtotal',
    // Checkout
    'checkout.step1': 'Cart Review',
    'checkout.step2': 'Shipping Info',
    'checkout.step3': 'Confirm Order',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.placeOrder': 'Place Order',
    'checkout.back': 'Back',
    'checkout.next': 'Continue',
    'checkout.loginRequired': 'Please sign in to complete your order',
    'checkout.success': 'Order placed successfully!',
    'checkout.successHint': "We'll contact you shortly to confirm shipping",
    // Wishlist
    'wishlist.title': 'My Wishlist',
    'wishlist.empty': 'Your wishlist is empty',
    'wishlist.emptyHint': 'Save products you love to find them here later',
    'wishlist.remove': 'Remove',
    'wishlist.loginRequired': 'Sign in to view your wishlist',
    // Auth
    'auth.login': 'Sign In',
    'auth.register': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.loginBtn': 'Sign In',
    'auth.registerBtn': 'Create Account',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.welcome': 'Welcome back',
    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong, please try again',
    'common.retry': 'Retry',
    'common.hi': 'Hi',
    // Footer
    'footer.tagline': 'Elegance that reflects your values',
    'footer.about': 'Muslima is a premium modest fashion boutique for the modern Muslim woman.',
    'footer.contact': 'Contact Us',
    'footer.phone': '+20 100 000 0000',
    'footer.email': 'info@muslima.boutique',
    'footer.follow': 'Follow Us',
    'footer.links': 'Quick Links',
    'footer.rights': '© 2025 Muslima — All rights reserved',
    'footer.newsletter': 'Subscribe to our newsletter',
    'footer.newsletterBtn': 'Subscribe',
    'footer.newsletterPlaceholder': 'Your email address',
  },
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('muslima_lang') || 'ar';
  });

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('muslima_lang', lang);
  };

  const t = (key, vars = {}) => {
    let text = (translations[language] && translations[language][key]) || key;
    // Simple variable interpolation: {amount}, {count}
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: switchLanguage, t, isRTL }}>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={language}
        className={isRTL ? 'font-arabic' : 'font-english'}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
