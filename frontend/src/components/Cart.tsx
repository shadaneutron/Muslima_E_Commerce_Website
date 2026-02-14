
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, X } from 'lucide-react';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { t } = useLanguage();
  
  if (items.length === 0) {
    return (
      <Card className="bg-white border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-900">{t('cart.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-stone-700 py-8">{t('cart.empty')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white border-stone-200">
      <CardHeader>
        <CardTitle className="text-stone-900">{t('cart.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border rounded-lg">
            <img 
              src={item.image} 
              alt={item.name.ar}
              className="w-16 h-16 object-cover rounded"
            />
            
            <div className="flex-1">
              <h4 className="font-medium text-stone-900">{item.name.ar}</h4>
              <p className="text-sm text-stone-700">
                {t('products.size')}: {item.selectedSize} | {t('products.color')}: {item.selectedColor}
              </p>
              <p className="text-lg font-bold text-amber-600">{item.price} {t('products.price')}</p>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center text-stone-900">{item.quantity}</span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold text-stone-900">
            <span className="text-stone-900">{t('cart.total')}</span>
            <span className="text-amber-700">{getTotalPrice()} {t('products.price')}</span>
          </div>
          
          <Button 
            onClick={onCheckout}
            className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
            size="lg"
          >
            {t('cart.checkout')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
