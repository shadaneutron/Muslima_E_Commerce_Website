import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API } from '@/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MapPin, ShoppingBag, ChevronRight, ChevronLeft, Package, CreditCard, Phone } from 'lucide-react';

const getImg = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=60';
  if (url.startsWith('http')) return url;
  let cleanPath = url;
  if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('media/')) {
    cleanPath = `/media/${cleanPath}`;
  } else if (cleanPath.startsWith('media/')) {
    cleanPath = `/${cleanPath}`;
  }
  const apiBase = API.endsWith('/') ? API.slice(0, -1) : API;
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${apiBase}${finalPath}`;
};

const STEPS = [
  { id: 1, label: 'مراجعة السلة', icon: ShoppingBag },
  { id: 2, label: 'بيانات الشحن', icon: MapPin },
  { id: 3, label: 'تأكيد الطلب', icon: CheckCircle },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-10">
    {STEPS.map((step, index) => {
      const Icon = step.icon;
      const isActive = step.id === currentStep;
      const isCompleted = step.id < currentStep;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
              isActive ? 'border-[var(--gold-accent)] bg-[var(--gold-accent)] text-white shadow-lg' : 
              isCompleted ? 'border-[var(--text-dark)] bg-[var(--text-dark)] text-white' : 
              'border-[var(--border-color)] bg-transparent text-[var(--soft-brown)]'
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
              isActive ? 'text-[var(--gold-accent)]' : isCompleted ? 'text-[var(--text-dark)]' : 'text-[var(--soft-brown)]/60'
            }`}>
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`w-12 md:w-20 h-px mx-2 mb-6 transition-all duration-300 ${
              isCompleted ? 'bg-[var(--text-dark)]' : 'bg-[var(--border-color)]'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// Step 1: Cart Review
const CartReview = ({ cartItems, onNext }) => (
  <div className="space-y-6">
    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
      {cartItems.map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[var(--border-color)]">
          <img
            src={getImg(item.image)}
            alt={item.name}
            className="w-20 h-24 object-cover bg-[var(--bg-color)]"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=60'; }}
          />
          <div className="flex-grow">
            <p className="font-semibold text-[var(--text-dark)] text-sm mb-1 uppercase tracking-wider">{item.name}</p>
            <p className="text-[var(--soft-brown)]/80 text-xs font-light uppercase tracking-widest">الكمية: {item.quantity}</p>
          </div>
          <p className="font-bold text-[var(--gold-accent)] text-lg">{(item.price * item.quantity).toFixed(0)} <span className="text-xs uppercase tracking-widest">ج.م</span></p>
        </div>
      ))}
    </div>
    <Button
      onClick={onNext}
      className="w-full bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white h-14 rounded-none font-semibold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
    >
      متابعة للشحن
      <ChevronLeft className="w-5 h-5" />
    </Button>
  </div>
);

// Step 2: Shipping
const ShippingForm = ({
  fullName, setFullName,
  address, setAddress,
  city, setCity,
  phone, setPhone,
  postalCode, setPostalCode,
  governorates,
  selectedGov, setSelectedGov,
  errors, setErrors,
  onNext, onBack
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="space-y-6 p-8 bg-white border border-[var(--border-color)] shadow-sm">
      <h3 className="text-sm font-bold tracking-widest text-[var(--text-dark)] uppercase border-b border-[var(--border-color)] pb-3 mb-4 font-['Cairo']">
        بيانات المستلم والشحن
      </h3>

      {/* Full Name */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>الاسم الكامل للمستلم *</span>
          {errors.fullName && <span className="text-red-500 font-normal text-[10px]">{errors.fullName}</span>}
        </Label>
        <Input
          placeholder="الاسم الثلاثي أو الثنائي"
          className={`bg-transparent border ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 text-right px-4 transition-all`}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
          }}
          dir="rtl"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>رقم الهاتف المصري *</span>
          {errors.phone && <span className="text-red-500 font-normal text-[10px]">{errors.phone}</span>}
        </Label>
        <div className="relative">
          <Phone className="absolute right-3 top-3.5 w-4 h-4 text-[var(--soft-brown)]/50" />
          <Input
            placeholder="01xxxxxxxxx"
            className={`bg-transparent border ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 font-['Inter'] text-right pr-10 transition-all`}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
            }}
            dir="ltr"
          />
        </div>
      </div>

      {/* Governorate */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>المحافظة *</span>
          {errors.governorate && <span className="text-red-500 font-normal text-[10px]">{errors.governorate}</span>}
        </Label>
        <select
          className={`w-full bg-transparent border ${errors.governorate ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 text-right px-3 outline-none transition-colors`}
          value={selectedGov?._id || ''}
          onChange={(e) => {
            const gov = governorates.find(g => g._id === parseInt(e.target.value));
            setSelectedGov(gov);
            if (errors.governorate) setErrors(prev => ({ ...prev, governorate: null }));
          }}
          dir="rtl"
        >
          <option value="">اختر المحافظة...</option>
          {governorates.map(gov => (
            <option key={gov._id} value={gov._id}>{gov.name} (+{gov.shipping_cost} ج.م)</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>المدينة / المنطقة *</span>
          {errors.city && <span className="text-red-500 font-normal text-[10px]">{errors.city}</span>}
        </Label>
        <Input
          placeholder="مثال: المعادي / التجمع الخامس"
          className={`bg-transparent border ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 text-right px-4 transition-all`}
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (errors.city) setErrors(prev => ({ ...prev, city: null }));
          }}
          dir="rtl"
        />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>العنوان التفصيلي *</span>
          {errors.address && <span className="text-red-500 font-normal text-[10px]">{errors.address}</span>}
        </Label>
        <Input
          placeholder="اسم الشارع، رقم العمارة، رقم الشقة"
          className={`bg-transparent border ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 text-right px-4 transition-all`}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (errors.address) setErrors(prev => ({ ...prev, address: null }));
          }}
          dir="rtl"
        />
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <Label className="font-semibold text-[var(--text-dark)] text-xs uppercase tracking-widest flex items-center justify-between">
          <span>الرمز البريدي (5 أرقام) *</span>
          {errors.postalCode && <span className="text-red-500 font-normal text-[10px]">{errors.postalCode}</span>}
        </Label>
        <Input
          placeholder="11511"
          className={`bg-transparent border ${errors.postalCode ? 'border-red-500 focus:border-red-500' : 'border-[var(--border-color)] focus:border-[var(--gold-accent)]'} rounded-none h-12 font-['Inter'] text-right px-4 transition-all`}
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
            if (errors.postalCode) setErrors(prev => ({ ...prev, postalCode: null }));
          }}
          dir="ltr"
        />
      </div>

      <div className="p-4 bg-[var(--primary-beige)]/10 border border-[var(--primary-beige)]/30 flex items-center gap-3 text-xs text-[var(--soft-brown)] font-medium tracking-widest uppercase mt-6">
        <Package className="w-4 h-4 flex-shrink-0 text-[var(--gold-accent)]" />
        <span>الدفع عند الاستلام (COD) متاح لجميع المحافظات</span>
      </div>
    </div>
    <div className="flex gap-4">
      <Button onClick={onBack} variant="outline" className="flex-1 border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--bg-color)] rounded-none h-14 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-semibold">
        <ChevronRight className="w-4 h-4" />
        رجوع
      </Button>
      <Button
        onClick={onNext}
        className="flex-[2] bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white h-14 rounded-none font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
      >
        مراجعة الطلب
        <ChevronLeft className="w-5 h-5" />
      </Button>
    </div>
  </div>
);

// Step 3: Order Summary + Confirm
const OrderSummary = ({ cartItems, address, city, phone, governorate, itemsPrice, shippingPrice, totalPrice, onPlaceOrder, onBack, loading }) => (
  <div className="space-y-6">
    <div className="p-6 bg-[var(--bg-color)] border border-[var(--border-color)] space-y-5">
      <div className="space-y-2">
        <h4 className="font-semibold text-[var(--text-dark)] flex items-center gap-2 text-xs uppercase tracking-widest">
          <MapPin className="w-4 h-4 text-[var(--gold-accent)]" />
          عنوان الشحن
        </h4>
        <p className="text-sm text-[var(--soft-brown)] bg-white p-4 border border-[var(--border-color)] leading-relaxed">
          {address}، {city}، {governorate?.name}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-[var(--text-dark)] flex items-center gap-2 text-xs uppercase tracking-widest">
          <Phone className="w-4 h-4 text-[var(--gold-accent)]" />
          رقم التواصل
        </h4>
        <p className="text-sm text-[var(--soft-brown)] bg-white p-4 border border-[var(--border-color)] font-['Inter']" dir="ltr">
          {phone}
        </p>
      </div>
    </div>

    <div className="p-6 bg-white border border-[var(--border-color)] space-y-4">
      <h4 className="font-semibold text-[var(--text-dark)] mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
        <CreditCard className="w-4 h-4 text-[var(--gold-accent)]" />
        ملخص الفاتورة
      </h4>
      <div className="space-y-3">
        {cartItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm text-[var(--soft-brown)] gap-4 border-b border-[var(--border-color)] pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <img
                src={getImg(item.image)}
                alt={item.name}
                className="w-12 h-16 object-cover bg-[var(--bg-color)] border border-[var(--border-color)]"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=60'; }}
              />
              <div>
                <p className="font-semibold text-[var(--text-dark)] uppercase tracking-wider text-xs">{item.name}</p>
                <p className="text-[var(--soft-brown)]/80 text-[10px] tracking-widest">الكمية: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold text-[var(--text-dark)]">{(item.price * item.quantity).toFixed(0)} ج.م</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border-color)] pt-4 space-y-3 mt-4">
        <div className="flex justify-between text-xs text-[var(--soft-brown)] font-light uppercase tracking-widest">
          <span>المنتجات</span>
          <span className="font-medium">{" "}{itemsPrice.toFixed(0)} ج.م</span>
        </div>
        <div className="flex justify-between text-xs text-[var(--soft-brown)] font-light uppercase tracking-widest">
          <span>مصاريف الشحن ({governorate?.name})</span>
          <span className="font-medium">{shippingPrice > 0 ? `${shippingPrice} ج.م` : 'مجاني'}</span>
        </div>
        <div className="flex justify-between text-2xl font-black text-[var(--text-dark)] border-t border-[var(--border-color)] pt-4 mt-2">
          <span className="uppercase tracking-widest text-lg">الإجمالي:</span>
          <span className="text-[var(--gold-accent)]">{totalPrice.toFixed(0)} <span className="text-sm text-[var(--soft-brown)] font-medium uppercase tracking-widest">ج.م</span></span>
        </div>
      </div>
    </div>

    <div className="flex gap-4">
      <Button onClick={onBack} variant="outline" className="flex-1 border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--bg-color)] rounded-none h-14 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-semibold">
        <ChevronRight className="w-4 h-4" />
        تعديل
      </Button>
      <Button
        onClick={onPlaceOrder}
        disabled={loading}
        className="flex-[2] bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white h-14 rounded-none font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            تأكيد الطلب
          </>
        )}
      </Button>
    </div>
  </div>
);

const Checkout = ({ onBack }) => {
  const { cartItems, clearCart } = useCart();
  const { token, user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [governorates, setGovernorates] = useState([]);
  const [selectedGov, setSelectedGov] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const { data } = await axios.get(`${API}/api/governorates/`);
        setGovernorates(data);
      } catch (err) {
        console.error('Error fetching governorates:', err);
      }
    };
    fetchGovernorates();
  }, []);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = selectedGov ? parseFloat(selectedGov.shipping_cost) : 0;
  const totalPrice = itemsPrice + shippingPrice;

  const validateForm = () => {
    const newErrors = {};
    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = 'الاسم الكامل مطلوب ويجب أن يتكون من 3 أحرف على الأقل';
    }
    const phoneRegex = /^01[0125]\d{8}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      newErrors.phone = 'رقم الهاتف المصري غير صالح (يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015)';
    }
    if (!selectedGov) {
      newErrors.governorate = 'يرجى اختيار المحافظة لتحديد مصاريف الشحن';
    }
    if (!city || city.trim().length < 3) {
      newErrors.city = 'المنطقة / المدينة مطلوبة ويجب أن تتكون من 3 أحرف على الأقل';
    }
    if (!address || address.trim().length < 5) {
      newErrors.address = 'العنوان التفصيلي مطلوب ويجب أن يتكون من 5 أحرف على الأقل';
    }
    const postalRegex = /^\d{5}$/;
    if (!postalCode || !postalRegex.test(postalCode.trim())) {
      newErrors.postalCode = 'الرمز البريدي مطلوب ويجب أن يتكون من 5 أرقام (مثال: 11511)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!user) return toast({ title: 'خطأ', description: 'سجلي دخولك أولاً', variant: 'destructive' });
    if (cartItems.length === 0) return toast({ title: 'خطأ', description: 'السلة فارغة، أضيفي بعض المنتجات أولاً', variant: 'destructive' });
    if (!validateForm()) return toast({ title: 'خطأ في التحقق', description: 'يرجى تصحيح أخطاء مدخلات الشحن أولاً', variant: 'destructive' });
    
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const orderData = {
        orderItems: cartItems.map(item => ({
            product: item._id,
            qty: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
        })),
        shippingAddress: { 
            fullName: fullName.trim(),
            address: address.trim(), 
            city: city.trim(), 
            governorate: selectedGov._id,
            phone: phone.trim(),
            country: 'Egypt', 
            postalCode: postalCode.trim() 
        },
        paymentMethod: 'Cash on Delivery',
        taxPrice: 0,
        shippingPrice,
        totalPrice,
      };
      const { data } = await axios.post(`${API}/api/orders/add/`, orderData, config);
      toast({ title: 'تم الطلب بنجاح!', description: 'سنتواصل معكِ قريباً لتأكيد الطلب' });
      clearCart();
      window.location.href = `/order/${data._id}`;
    } catch (error) {
      toast({
        title: 'فشل الطلب',
        description: error.response?.data?.detail || 'خطأ في الاتصال بالسيرفر',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 font-['Cairo']" dir="rtl">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <CartReview cartItems={cartItems} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <ShippingForm
          fullName={fullName}
          setFullName={setFullName}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          phone={phone}
          setPhone={setPhone}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          governorates={governorates}
          selectedGov={selectedGov}
          setSelectedGov={setSelectedGov}
          errors={errors}
          setErrors={setErrors}
          onNext={() => {
            if (validateForm()) {
              setStep(3);
            }
          }}
          onBack={() => { setStep(1); if (onBack) onBack(); }}
        />
      )}
      {step === 3 && (
        <OrderSummary
          cartItems={cartItems}
          address={`${fullName} - ${address}`}
          city={city}
          phone={phone}
          governorate={selectedGov}
          itemsPrice={itemsPrice}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
          onPlaceOrder={placeOrder}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Checkout;