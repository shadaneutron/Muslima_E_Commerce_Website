import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const FallbackImg = '/products/placeholder.svg';

const ProductCard = ({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor);
    toast({
      title: language === 'ar' ? 'تم إضافة المنتج' : 'Product Added',
      description: language === 'ar' ? 'تم إضافة المنتج إلى السلة بنجاح' : 'Product added to cart successfully',
    });
  };
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border-amber-200">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name[language]}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = FallbackImg; }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">
              {t('products.outOfStock')}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-amber-900">{product.name[language]}</h3>
        <p className="text-amber-700 text-sm mb-3">{product.description[language]}</p>
        <p className="text-2xl font-bold text-amber-600 mb-4">
          {product.price} {t('products.price')}
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-amber-100 text-amber-800">{t('products.size')}: {selectedSize}</Badge>
          <Badge className="bg-amber-100 text-amber-800">{t('products.color')}: {selectedColor}</Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">{t('products.size')}</label>
            <div className="mt-2 flex flex-wrap gap-2">
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
            <label className="block text-sm font-medium mb-1 text-amber-800">{t('products.color')}</label>
            <div className="mt-2 flex flex-wrap gap-2">
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
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3 w-full">
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400"
        >
          {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
        </Button>
        <Link to={`/product/${product.id}`} className="inline-flex items-center justify-center rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100">
          تفاصيل المنتج
        </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
