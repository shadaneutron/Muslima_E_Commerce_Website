
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }
    
    // Simulate order processing
    toast({
      title: 'تم تأكيد الطلب',
      description: 'سيتم التواصل معك قريباً لتأكيد التفاصيل',
    });
    
    clearCart();
    onBack();
  };
  
  return (
    <div className="space-y-6 text-stone-900">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← العودة للسلة
      </Button>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-900">{t('checkout.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-stone-900">{t('checkout.customerInfo')}</h3>
                
                <div>
                  <Label htmlFor="name" className="text-stone-800">{t('checkout.name')}</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="bg-white text-stone-900 placeholder:text-stone-500 border-stone-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-stone-800">{t('checkout.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="bg-white text-stone-900 placeholder:text-stone-500 border-stone-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-stone-800">{t('checkout.phone')}</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="bg-white text-stone-900 placeholder:text-stone-500 border-stone-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-stone-800">{t('checkout.address')}</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    className="bg-white text-stone-900 placeholder:text-stone-500 border-stone-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city" className="text-stone-800">{t('checkout.city')}</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className="bg-white text-stone-900 placeholder:text-stone-500 border-stone-300"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-stone-900">{t('checkout.paymentMethod')}</h3>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="text-stone-800">{t('checkout.bankTransfer')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="visa" id="visa" />
                    <Label htmlFor="visa" className="text-stone-800">{t('checkout.visa')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="text-stone-800">{t('checkout.cod')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'bank' && (
                <div className="bg-blue-50 p-4 rounded-lg text-stone-900">
                  <h4 className="font-semibold mb-2 text-stone-900">معلومات التحويل البنكي:</h4>
                  <p className="text-sm text-stone-800">البنك الأهلي السعودي</p>
                  <p className="text-sm text-stone-800">رقم الحساب: 1234567890</p>
                  <p className="text-sm text-stone-800">اسم المستفيد: متجر مُسلمة</p>
                </div>
              )}
              
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                {t('checkout.placeOrder')}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-900">ملخص الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{item.name.ar}</p>
                    <p className="text-sm text-stone-700">الكمية: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-stone-900">{item.price * item.quantity} ريال</p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-stone-900">
                  <span className="text-stone-900">المجموع الكلي</span>
                  <span className="text-stone-900">{getTotalPrice()} ريال</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
