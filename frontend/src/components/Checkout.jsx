import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Checkout = ({ onBack }) => {
  const { cartItems, clearCart } = useCart();
  const { token, user } = useAuth();
  const { toast } = useToast();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50; 
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrder = async () => {
    if (!user) return toast({ title: "خطأ", description: "سجلي دخولك أولاً" });
    if (!address || !city) return toast({ title: "بيانات ناقصة", description: "أكملي بيانات العنوان" });

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, country: 'Egypt', postalCode: '0000' },
        paymentMethod: 'Cash on Delivery',
        taxPrice: 0,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      };

      await axios.post('http://127.0.0.1:8080/api/orders/add/', orderData, config);
      
      toast({ title: "تم الطلب بنجاح!" });
      clearCart();
      window.location.href = '/'; 
    } catch (error) {
      toast({ 
        title: "فشل الطلب", 
        description: error.response?.data?.detail || "خطأ في الاتصال بالسيرفر",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 text-[#451a03] font-['Tajawal']">
      <div className="space-y-6 bg-orange-50/50 p-8 rounded-3xl border border-amber-100">
        <h3 className="text-xl font-bold">بيانات الشحن</h3>
        <Input placeholder="العنوان" className="bg-white border-amber-200" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input placeholder="المدينة" className="bg-white border-amber-200" value={city} onChange={(e) => setCity(e.target.value)} />
        <Button onClick={onBack} variant="link" className="text-amber-700">تعديل السلة</Button>
      </div>

      <div className="bg-white p-8 rounded-3xl border-2 border-amber-50 shadow-sm">
        <h3 className="text-xl font-bold mb-6">ملخص الحساب</h3>
        <div className="flex justify-between text-2xl font-bold text-amber-900 mb-8">
          <span>الإجمالي:</span><span>{totalPrice} ج.م</span>
        </div>
        <Button onClick={placeOrder} className="w-full bg-amber-600 hover:bg-amber-700 h-14 text-xl font-bold text-white rounded-2xl shadow-lg">تأكيد الطلب</Button>
      </div>
    </div>
  );
};

export default Checkout;