
import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: {
      ar: 'عباءة كلاسيكية سوداء',
      en: 'Classic Black Abaya'
    },
    description: {
      ar: 'عباءة أنيقة من القماش الفاخر مع تفاصيل مطرزة يدوياً',
      en: 'Elegant abaya made from luxury fabric with hand-embroidered details'
    },
    price: 299,
    category: 'abayas',
    image: '/products/81e3f46c-c361-4e65-83d0-f37189b95335.jpg',
    images: ['/products/81e3f46c-c361-4e65-83d0-f37189b95335.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'كحلي', 'رمادي'],
    inStock: true
  },
  {
    id: '2',
    name: {
      ar: 'جلباب مطرز بالذهبي',
      en: 'Gold Embroidered Jilbab'
    },
    description: {
      ar: 'جلباب فاخر مزين بتطريز ذهبي مناسب للمناسبات الخاصة',
      en: 'Luxury jilbab adorned with gold embroidery perfect for special occasions'
    },
    price: 449,
    category: 'jilbabs',
    image: '/products/685a889b-e65b-4c3d-bd09-c1b4a63283db.jpg',
    images: ['/products/685a889b-e65b-4c3d-bd09-c1b4a63283db.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'بيج', 'أزرق داكن'],
    inStock: true
  },
  {
    id: '3',
    name: {
      ar: 'عباءة كيمونو عصرية',
      en: 'Modern Kimono Abaya'
    },
    description: {
      ar: 'عباءة بتصميم كيمونو عصري مريح ومناسب للاستخدام اليومي',
      en: 'Modern kimono-style abaya comfortable and suitable for daily wear'
    },
    price: 249,
    category: 'abayas',
    image: '/products/c72b86f9-c1d2-4571-ad60-ee19e149a8e3.jpg',
    images: ['/products/c72b86f9-c1d2-4571-ad60-ee19e149a8e3.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'بني', 'أخضر زيتوني'],
    inStock: true
  },
  {
    id: '4',
    name: {
      ar: 'حجاب حريري فاخر',
      en: 'Luxury Silk Hijab'
    },
    description: {
      ar: 'حجاب من الحرير الطبيعي عالي الجودة بألوان متدرجة',
      en: 'High-quality natural silk hijab with gradient colors'
    },
    price: 89,
    category: 'hijabs',
    image: '/products/0cbb2874-5304-4df0-b976-8076c5e763f1.jpg',
    images: ['/products/0cbb2874-5304-4df0-b976-8076c5e763f1.jpg'],
    sizes: ['One Size'],
    colors: ['وردي', 'أزرق', 'بيج', 'أخضر'],
    inStock: true
  },
  {
    id: '5',
    name: {
      ar: 'عباءة بأكمام واسعة',
      en: 'Wide Sleeve Abaya'
    },
    description: {
      ar: 'عباءة مريحة بأكمام واسعة وتصميم عملي للحياة اليومية',
      en: 'Comfortable abaya with wide sleeves and practical design for daily life'
    },
    price: 199,
    category: 'abayas',
    image: '/products/4ed787d4-b9e5-4c2a-930e-8b15468303ea.jpg',
    images: ['/products/4ed787d4-b9e5-4c2a-930e-8b15468303ea.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'كحلي', 'بني فاتح'],
    inStock: false
  },
  {
    id: '6',
    name: {
      ar: 'جلباب للمناسبات',
      en: 'Occasion Jilbab'
    },
    description: {
      ar: 'جلباب أنيق مناسب للمناسبات الرسمية والاحتفالات',
      en: 'Elegant jilbab suitable for formal occasions and celebrations'
    },
    price: 379,
    category: 'jilbabs',
    image: '/products/fd92d613-d093-4269-9a79-55ddced4d89a.jpg',
    images: ['/products/fd92d613-d093-4269-9a79-55ddced4d89a.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'أزرق ملكي', 'بورجوندي'],
    inStock: true
  }
];
