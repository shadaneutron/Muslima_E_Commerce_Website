import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const Cart = ({ onCheckout }) => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const { language, t } = useLanguage();

  // الحماية هنا: لو cartItems مش موجودة لأي سبب، نعتبرها مصفوفة فاضية
  const safeCartItems = cartItems || [];

  const totalPrice = safeCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (safeCartItems.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <ShoppingCart className="h-16 w-16 text-amber-200" />
        <p className="text-xl text-amber-900 font-medium">
          {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#451a03]">
      <div className="space-y-4">
        {safeCartItems.map((item) => (
          <div key={`${item._id}-${item.size}-${item.color}`} className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-amber-100">
            <img 
              src={item.image ? `http://127.0.0.1:8080${item.image}` : '/products/placeholder.svg'} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-xl" 
            />
            
            <div className="flex-grow">
              <h4 className="font-bold text-lg">{item.name}</h4>
              <p className="text-sm text-amber-700">
                {item.size} | {item.color}
              </p>
              <p className="font-bold text-amber-600">{item.price} ج.م</p>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full border-amber-200"
                onClick={() => removeFromCart(item._id, item.size, item.color)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-amber-100 pt-6 space-y-4">
        <div className="flex justify-between text-xl font-bold text-amber-900">
          <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
          <span>{totalPrice} ج.م</span>
        </div>
        <Button 
          onClick={onCheckout}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white h-14 text-lg font-bold shadow-md"
        >
          {language === 'ar' ? 'الذهاب لإتمام الطلب' : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  );
};

export default Cart;