import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Package, MapPin, Phone, CreditCard, Calendar, Clock, 
  CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, Truck, Sparkles 
} from 'lucide-react';
import { API } from '@/config';

const OrderDetail = () => {
  const { id } = useParams();
  const { language, isRTL } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${API}/api/orders/${id}/`, config);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, token, navigate]);

  const getImg = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=80';
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

  // Determine stage completion based on status
  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'Pending', label: language === 'ar' ? 'تم استلام طلبكِ' : 'Order Placed', desc: language === 'ar' ? 'تم تأكيد طلبكِ بنجاح وسنقوم بمراجعته.' : 'Your order is registered and awaiting confirmation.' },
      { key: 'Processing', label: language === 'ar' ? 'جاري تجهيز القطع' : 'Processing', desc: language === 'ar' ? 'نقوم الآن بتجهيز وتغليف قطعكِ الراقية.' : 'We are carefully packing your modest garments.' },
      { key: 'Shipped', label: language === 'ar' ? 'طلبكِ مع المندوب' : 'Shipped', desc: language === 'ar' ? 'تم تسليم الشحنة لشركة الشحن وسنتواصل معكِ قريباً.' : 'Your luxury parcel is now out for delivery.' },
      { key: 'Delivered', label: language === 'ar' ? 'تم التوصيل بنجاح' : 'Delivered', desc: language === 'ar' ? 'شكرًا لشرائكِ من دار مسلمة، نتمنى أن تنال القطع إعجابكِ.' : 'Delivered safely. Thank you for shopping at Muslima.' },
    ];

    let currentIdx = 0;
    if (status === 'Processing') currentIdx = 1;
    else if (status === 'Shipped') currentIdx = 2;
    else if (status === 'Delivered') currentIdx = 3;
    else if (status === 'Cancelled') currentIdx = -1;

    return steps.map((step, idx) => {
      const isCompleted = idx <= currentIdx && currentIdx !== -1;
      const isActive = idx === currentIdx;
      return { ...step, isCompleted, isActive };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-32 md:py-40 text-center">
          <div className="skeleton h-12 w-48 mx-auto mb-10" />
          <div className="skeleton h-64 max-w-4xl mx-auto rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header onCartClick={() => {}} />
        <div className="container mx-auto px-4 py-32 md:py-40 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'عذراً، لم نتمكن من العثور على هذا الطلب' : 'Failed to retrieve order details'}</h2>
          <Link to="/orders" className="inline-flex items-center gap-2 bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white px-8 py-4 font-bold text-xs uppercase tracking-widest transition-colors">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === 'ar' ? 'العودة لطلباتي' : 'Back to My Orders'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = getTimelineSteps(order.status);
  const isCancelled = order.status === 'Cancelled';
  const subtotal = order.orderItems?.reduce((sum, item) => sum + Number(item.price) * item.qty, 0) || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onCartClick={() => {}} />

      <main className="container mx-auto px-4 py-8 pt-32 md:pt-40 max-w-5xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/orders"
            className="inline-flex items-center gap-2 text-[var(--soft-brown)] hover:text-[var(--text-dark)] text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === 'ar' ? 'العودة لطلباتي' : 'Back to My Orders'}
          </Link>
        </div>

        {/* Branded Section Header */}
        <div className="bg-white border border-[var(--border-color)] p-6 rounded-t-xl flex flex-wrap items-center justify-between gap-4 shadow-sm border-b-0">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--soft-brown)]/60 tracking-wider block">
              {language === 'ar' ? 'تفاصيل الفاتورة' : 'Order Reference'}
            </span>
            <h1 className="text-xl md:text-2xl font-mono font-black text-[var(--text-dark)]">
              #{order._id}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--soft-brown)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="bg-white border border-[var(--border-color)] p-6 rounded-b-xl space-y-12 shadow-sm">
          
          {/* TIMELINE TRACKER STAGES */}
          <div className="py-6 border-b border-[var(--border-color)]/60">
            {isCancelled ? (
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-200">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-rose-950 font-bold text-lg mb-1">
                    {language === 'ar' ? 'تم إلغاء هذا الطلب' : 'Order Cancelled'}
                  </h3>
                  <p className="text-rose-800 text-sm font-light">
                    {language === 'ar' 
                      ? 'تم إلغاء طلبكِ الحالي. يرجى التواصل معنا إذا كنتِ تعتقدين أن هذا تم عن طريق الخطأ.' 
                      : 'This transaction was cancelled. Please contact us for support.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Visual Progress Bar Line */}
                <div className="absolute top-[20px] left-8 right-8 h-1 bg-[var(--border-color)] hidden md:block" />
                
                {/* Horizontal grid on desktop, vertical on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                      {/* Step Indicator Dot */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        step.isCompleted 
                          ? 'bg-[var(--gold-accent)] border-[var(--gold-accent)] text-white shadow-md' 
                          : 'bg-white border-[var(--border-color)] text-[var(--soft-brown)]/40'
                      }`}>
                        {step.isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-xs font-bold font-mono">{idx + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Content Labels */}
                      <div className="flex-1 md:flex-none">
                        <h4 className={`text-sm font-bold tracking-wide uppercase ${
                          step.isActive ? 'text-[var(--gold-accent)] font-extrabold' : 
                          step.isCompleted ? 'text-[var(--text-dark)] font-semibold' : 'text-[var(--soft-brown)]/40'
                        }`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-[var(--soft-brown)]/60 font-light mt-1 max-w-[200px] md:mx-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[var(--border-color)]/60 pb-10">
            {/* Address */}
            <div className="space-y-4 bg-[var(--bg-color)] p-6 rounded-xl border border-[var(--border-color)]">
              <h3 className="text-sm font-bold tracking-widest text-[var(--text-dark)] uppercase flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <MapPin className="w-4 h-4 text-[var(--gold-accent)]" />
                {language === 'ar' ? 'عنوان وتفاصيل الشحن' : 'Delivery details'}
              </h3>
              <div className="space-y-3 text-xs text-[var(--text-dark)]">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--soft-brown)]/80 uppercase tracking-wide w-20 block">
                    {language === 'ar' ? 'العنوان:' : 'Street:'}
                  </span>
                  <span>{order.shippingAddress?.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--soft-brown)]/80 uppercase tracking-wide w-20 block">
                    {language === 'ar' ? 'المدينة:' : 'City:'}
                  </span>
                  <span>{order.shippingAddress?.city}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--soft-brown)]/80 uppercase tracking-wide w-20 block">
                    {language === 'ar' ? 'المحافظة:' : 'Governorate:'}
                  </span>
                  <span>{order.shippingAddress?.governorate_name || (language === 'ar' ? 'محافظة مصرية' : 'Egypt Governorate')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--soft-brown)]/80 uppercase tracking-wide w-20 block">
                    {language === 'ar' ? 'الهاتف:' : 'Phone:'}
                  </span>
                  <span className="font-mono flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[var(--soft-brown)]" />
                    {order.shippingAddress?.phone}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 bg-[var(--bg-color)] p-6 rounded-xl border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-widest text-[var(--text-dark)] uppercase flex items-center gap-2 border-b border-[var(--border-color)] pb-3 font-['Cairo']">
                  <CreditCard className="w-4 h-4 text-[var(--gold-accent)]" />
                  {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                </h3>
                <div className="mt-4 flex items-center gap-3 text-xs text-[var(--text-dark)]">
                  <div className="p-3 bg-[var(--primary-beige)]/20 border border-[var(--border-color)]">
                    <ShieldCheck className="w-5 h-5 text-[var(--gold-accent)]" />
                  </div>
                  <div>
                    <span className="font-bold block mb-1">
                      {order.paymentMethod === 'Cash on Delivery' ? (language === 'ar' ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery (COD)') : order.paymentMethod}
                    </span>
                    <span className="text-[10px] text-[var(--soft-brown)]/80 uppercase tracking-wider block">
                      {language === 'ar' ? 'آمن وموثوق ومضمون بنسبة ١٠٠٪' : '100% Secure Transaction'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="border-t border-[var(--border-color)] pt-4 mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--soft-brown)] uppercase tracking-wide">
                  {language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}
                </span>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                  order.isPaid 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {order.isPaid ? (language === 'ar' ? 'تم الدفع بنجاح' : 'Paid') : (language === 'ar' ? 'معلق (عند الاستلام)' : 'Pending COD')}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Items Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-widest text-[var(--text-dark)] uppercase flex items-center gap-2 border-b border-[var(--border-color)] pb-3 font-['Cairo']">
              <Package className="w-4 h-4 text-[var(--gold-accent)]" />
              {language === 'ar' ? 'المنتجات المطلوبة' : 'Items Placed'}
            </h3>

            {/* List */}
            <div className="divide-y divide-[var(--border-color)]/60">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-5 flex items-center gap-6">
                  {/* Image */}
                  <div className="w-16 h-20 bg-[var(--bg-color)] border border-[var(--border-color)] overflow-hidden shrink-0">
                    <img 
                      src={getImg(item.image)} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&q=75'; }}
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-[var(--text-dark)] hover:text-[var(--gold-accent)] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-bold text-[var(--soft-brown)]/60 uppercase tracking-widest">
                      {language === 'ar' ? 'الكمية:' : 'Qty:'} <span className="text-[var(--text-dark)] font-mono">{item.qty}</span>
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-[var(--soft-brown)] block">
                      {Number(item.price).toLocaleString()} EGP
                    </span>
                    <span className="text-sm font-black text-[var(--text-dark)] block">
                      {(Number(item.price) * item.qty).toLocaleString()} EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing totals */}
          <div className="border-t border-[var(--border-color)] pt-8 flex justify-end">
            <div className="w-full md:w-80 space-y-4 text-xs font-semibold text-[var(--soft-brown)]">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="text-[var(--text-dark)] font-bold">{subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'مصاريف الشحن والتوصيل:' : 'Shipping & Delivery:'}</span>
                <span className="text-[var(--text-dark)] font-bold">
                  {Number(order.shippingPrice) === 0 ? (language === 'ar' ? 'شحن مجاني' : 'Complimentary') : `${Number(order.shippingPrice).toLocaleString()} EGP`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-color)] pt-4 text-sm font-black text-[var(--text-dark)]">
                <span className="flex items-center gap-1 font-['Cairo']">
                  <Sparkles className="w-4 h-4 text-[var(--gold-accent)]" />
                  {language === 'ar' ? 'الإجمالي النهائي:' : 'Grand Total:'}
                </span>
                <span className="text-[var(--gold-accent)] text-lg">
                  {Number(order.totalPrice).toLocaleString()} EGP
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default OrderDetail;
