import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useLanguage, LanguageProvider } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '../contexts/CartContext';

const FallbackImg = '/products/placeholder.svg';

const ZoomImage = ({ src, alt }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(false);
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };
  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-white"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={onMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-[420px] object-cover"
        onError={(e) => { e.currentTarget.src = FallbackImg; }}
      />
      {zoom && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '200%',
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  );
};

const ProductDetailContent = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const product = useMemo(() => products.find(p => p.id === id), [id]);
  const images = product?.images && product.images.length > 0 ? product.images : [product?.image].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>المنتج غير موجود</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/" className="text-amber-700 underline">العودة للرئيسية</Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const add = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor
    });
  };
  
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-amber-700 underline">← العودة</Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ZoomImage src={selectedImage} alt={product.name[language]} />
            <div className="mt-3 flex gap-3">
              {images.map((img) => (
                <button
                  key={img}
                  className={`h-20 w-20 rounded-lg border overflow-hidden ${selectedImage === img ? 'ring-2 ring-amber-600' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt="thumb" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = FallbackImg; }} />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">{product.name[language]}</h1>
            <p className="text-stone-700 mb-4">{product.description[language]}</p>
            <p className="text-2xl font-bold text-amber-700 mb-6">{product.price} {t('products.price')}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="mb-2 text-stone-800">{t('products.size')}</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      variant={selectedSize === size ? "default" : "outline"}
                      className={selectedSize === size ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700"}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-stone-800">{t('products.color')}</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      size="sm"
                      variant={selectedColor === color ? "default" : "outline"}
                      className={selectedColor === color ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700"}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="bg-amber-600 hover:bg-amber-700 w-full mb-6" onClick={add}>
              {t('products.addToCart')}
            </Button>
            
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="bg-amber-100">
                <TabsTrigger value="details" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">التفاصيل</TabsTrigger>
                <TabsTrigger value="specs" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">المواصفات</TabsTrigger>
                <TabsTrigger value="policy" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">الشحن والاسترجاع</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="bg-white border rounded-lg p-4 text-stone-800">
                <ul className="list-disc pr-6 space-y-2">
                  <li>قماش فاخر وخياطة متقنة</li>
                  <li>راحة في الارتداء وتصميم عملي</li>
                  <li>ألوان متعددة لتناسب ذوقك</li>
                </ul>
              </TabsContent>
              <TabsContent value="specs" className="bg-white border rounded-lg p-4 text-stone-800">
                <ul className="list-disc pr-6 space-y-2">
                  <li>الفئة: {product.category}</li>
                  <li>المقاسات المتاحة: {product.sizes.join(', ')}</li>
                  <li>الألوان: {product.colors.join(', ')}</li>
                </ul>
              </TabsContent>
              <TabsContent value="policy" className="bg-white border rounded-lg p-4 text-stone-800">
                <p className="mb-2">الشحن داخل المملكة خلال 2-4 أيام عمل.</p>
                <p className="mb-2">الاسترجاع خلال 14 يوماً بشرط عدم استخدام المنتج وحفظ الفاتورة.</p>
                <p>لمزيد من المعلومات، تواصلي معنا عبر البريد: info@muslima.com</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

import { CartProvider } from '../contexts/CartContext';
export default function ProductDetail() {
  return (
    <LanguageProvider>
      <CartProvider>
        <ProductDetailContent />
      </CartProvider>
    </LanguageProvider>
  );
}
