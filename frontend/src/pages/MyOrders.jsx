import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Calendar, CreditCard, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { API } from '@/config';

const MyOrders = () => {
  const { language, isRTL } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${API}/api/orders/myorders/`, config);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-[var(--primary-beige)]/20 text-[var(--soft-brown)] border border-[var(--border-color)]',
          label: language === 'ar' ? 'قيد الانتظار' : 'Pending'
        };
      case 'Processing':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border border-amber-200',
          label: language === 'ar' ? 'جاري التجهيز' : 'Processing'
        };
      case 'Shipped':
        return {
          bg: 'bg-yellow-600/10 text-amber-900 border border-yellow-200',
          label: language === 'ar' ? 'تم الشحن' : 'Shipped'
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border border-emerald-200',
          label: language === 'ar' ? 'تم التوصيل' : 'Delivered'
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-500/10 text-rose-800 border border-rose-200',
          label: language === 'ar' ? 'ملغي' : 'Cancelled'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border border-gray-200',
          label: status
        };
    }
  };

  const getImg = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&q=75';
    if (url.startsWith('http')) return url;
    return `${API}${url}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onCartClick={() => {}} />

      <main className="container mx-auto px-4 py-8 pt-32 md:pt-40 max-w-5xl">
        {/* Header Title */}
        <div className="mb-12 animate-fade-up text-center md:text-start border-b border-[var(--border-color)] pb-8">
          <h1 className={`text-4xl font-black text-[var(--text-dark)] tracking-widest uppercase mb-3 ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
            {language === 'ar' ? 'طلباتي' : 'My Orders'}
          </h1>
          <p className="text-[var(--soft-brown)]/60 text-sm font-semibold tracking-widest uppercase">
            {language === 'ar' ? `لديكِ ${orders.length} طلبات سابقة` : `You have ${orders.length} past orders`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-white border border-[var(--border-color)] rounded-xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20 bg-white border border-[var(--border-color)] p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg font-bold text-[var(--text-dark)]">
              {language === 'ar' ? 'عذراً، فشل تحميل الطلبات' : 'Oops, failed to load your orders'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24 bg-white border border-[var(--border-color)] p-8 rounded-2xl animate-fade-in shadow-sm">
            <div className="w-20 h-20 bg-[var(--primary-beige)]/10 flex items-center justify-center mx-auto mb-8 rounded-full border border-[var(--primary-beige)]/20">
              <Package className="w-10 h-10 text-[var(--gold-accent)]" />
            </div>
            <h2 className={`text-2xl font-bold text-[var(--text-dark)] mb-3 ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {language === 'ar' ? 'لا توجد طلبات بعد' : 'No Orders Yet'}
            </h2>
            <p className="text-[var(--soft-brown)] text-sm mb-8 font-light max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'لم تقومي بطلب أي عباءات أو قطع من دار مسلمة حتى الآن. تصفحي مجموعاتنا الراقية الآن.'
                : 'You have not placed any elegant modest garments with Muslima Boutique yet.'}
            </p>
            <Link to="/" className="inline-block bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white font-bold text-xs tracking-widest uppercase px-12 py-5 transition-colors">
              {language === 'ar' ? 'تصفحي المتجر' : 'Browse Store'}
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const badge = getStatusBadge(order.status);
              return (
                <div 
                  key={order._id} 
                  className="bg-white border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-up shadow-sm"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                >
                  {/* Top Bar Info */}
                  <div className="bg-[var(--bg-color)] px-6 py-5 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--soft-brown)]/60 tracking-wider block mb-1">
                          {language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                        </span>
                        <span className="font-mono text-sm font-bold text-[var(--text-dark)]">
                          #{order._id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--soft-brown)]/60 tracking-wider block mb-1">
                          {language === 'ar' ? 'تاريخ الطلب' : 'Date Placed'}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--soft-brown)]" />
                          {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--soft-brown)]/60 tracking-wider block mb-1">
                          {language === 'ar' ? 'الإجمالي' : 'Total Amount'}
                        </span>
                        <span className="text-sm font-black text-[var(--gold-accent)]">
                          {Number(order.totalPrice).toLocaleString()} EGP
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Order Contents Preview */}
                  <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Item Thumbnails Grid */}
                    <div className="flex items-center gap-4 flex-wrap flex-1 w-full justify-start">
                      {order.orderItems?.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="relative w-16 h-20 bg-[var(--bg-color)] border border-[var(--border-color)] overflow-hidden group">
                          <img 
                            src={getImg(item.image)} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&q=75'; }}
                          />
                          {item.qty > 1 && (
                            <span className="absolute bottom-1 right-1 bg-[var(--text-dark)] text-white text-[10px] font-bold px-1.5 rounded-full">
                              x{item.qty}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.orderItems?.length > 4 && (
                        <div className="w-16 h-20 bg-[var(--primary-beige)]/20 border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--soft-brown)]">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Track Details button */}
                    <Link 
                      to={`/order/${order._id}`}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 border border-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-white text-[var(--text-dark)] font-bold text-xs tracking-widest uppercase px-6 py-4 transition-all duration-300 rounded-none cursor-pointer"
                    >
                      {language === 'ar' ? 'تتبع التفاصيل' : 'Track Order'}
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default MyOrders;
