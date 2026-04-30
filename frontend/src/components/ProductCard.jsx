import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const FallbackImg = '/products/placeholder.svg';

const ProductCard = ({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : 'Default');
  
  const imageUrl = product.image ? `http://127.0.0.1:8080${product.image}` : FallbackImg;

  const handleAddToCart = () => {
    if (product.countInStock <= 0) return;
    addToCart(product, selectedSize, selectedColor);
    toast({
      title: language === 'ar' ? 'تم إضافة المنتج' : 'Product Added',
      description: language === 'ar' ? 'تم إضافة المنتج إلى السلة بنجاح' : 'Product added successfully',
    });
  };
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border-amber-200 h-full flex flex-col">
      <img src={imageUrl} alt={product.name} className="w-full h-64 object-cover" onError={(e) => { e.currentTarget.src = FallbackImg; }} />
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2 text-amber-900">{product.name}</h3>
        <p className="text-amber-700 text-sm mb-3 line-clamp-2">{product.description}</p>
        <p className="text-2xl font-bold text-amber-600 mb-4">{product.price} {t('products.price')}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button onClick={handleAddToCart} disabled={product.countInStock <= 0} className="bg-amber-600 hover:bg-amber-700 text-white">
            {product.countInStock > 0 ? t('products.addToCart') : t('products.outOfStock')}
          </Button>
          <Link to={`/product/${product._id}`} className="inline-flex items-center justify-center rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100">
            {language === 'ar' ? 'التفاصيل' : 'Details'}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;