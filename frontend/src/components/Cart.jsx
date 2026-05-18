import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Minus, Plus, Trash2, ShoppingCart, Package, Truck } from 'lucide-react';
import { API } from '@/config';

const Cart = ({ onCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, shippingPrice, totalPrice } = useCart();
  const { language, t, isRTL } = useLanguage();

  const FREE_THRESHOLD = 1000;
  const toFree = Math.max(0, FREE_THRESHOLD - itemsPrice);
  const progress = Math.min(100, (itemsPrice / FREE_THRESHOLD) * 100);

  const getImg = (item) => {
    if (!item.image) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=60';
    if (item.image.startsWith('http')) return item.image;
    return `${API}${item.image}`;
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-[var(--primary-beige)]/10 flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-[var(--gold-accent)]" />
        </div>
        <div>
          <p className={`text-2xl font-semibold text-[var(--text-dark)] mb-2 uppercase tracking-widest ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
            {t('cart.empty')}
          </p>
          <p className="text-[var(--soft-brown)]/60 text-sm font-light uppercase tracking-widest">{t('cart.emptyHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Free Shipping Progress */}
      <div className="p-5 bg-[var(--primary-beige)]/10 border border-[var(--primary-beige)]/30 rounded-none">
        <div className="flex items-center gap-3 mb-3">
          <Truck className="w-4 h-4 text-[var(--gold-accent)]" />
          <p className="text-xs font-semibold text-[var(--soft-brown)] tracking-widest uppercase">
            {toFree === 0
              ? t('cart.shipping.free')
              : t('cart.shipping.progress', { amount: toFree.toFixed(0) })
            }
          </p>
        </div>
        <div className="w-full bg-[var(--border-color)] h-1 rounded-none overflow-hidden">
          <div className="bg-[var(--gold-accent)] h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={`${item._id}-${item.size}-${item.color}`}
            className="flex items-center gap-4 bg-white p-4 border border-[var(--border-color)] animate-fade-in rounded-none shadow-sm">
            <img src={getImg(item)} alt={item.name}
              className="w-20 h-24 object-cover bg-[var(--bg-color)] flex-shrink-0"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=60'; }}
            />
            <div className="flex-grow min-w-0">
              <p className={`font-semibold text-sm text-[var(--text-dark)] truncate mb-1 ${isRTL ? "font-['Cairo']" : "font-['Inter'] uppercase tracking-wider"}`}>{item.name}</p>
              <p className="text-xs text-[var(--soft-brown)]/80 uppercase tracking-widest">{item.size}</p>
              <p className="font-bold text-[var(--gold-accent)] text-sm mt-2">{(item.price * item.quantity).toFixed(0)} {t('products.currency')}</p>
            </div>
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--primary-beige)]/20 transition-colors rounded-none">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--primary-beige)]/20 transition-colors rounded-none">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeFromCart(item._id, item.size, item.color)}
                className="text-[var(--soft-brown)]/60 hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest font-semibold flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                {language === 'ar' ? 'حذف' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-[var(--border-color)] pt-6 space-y-3">
        <div className="flex justify-between text-sm text-[var(--soft-brown)] font-light tracking-widest uppercase">
          <span>{t('cart.subtotal')}</span>
          <span className="font-semibold text-[var(--text-dark)]">{itemsPrice.toFixed(0)} {t('products.currency')}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--soft-brown)] font-light tracking-widest uppercase">
          <span className="flex items-center gap-2"><Package className="w-4 h-4" />{t('cart.shipping.cost')}</span>
          <span className={`font-semibold ${shippingPrice === 0 ? 'text-[#4D5A4B]' : 'text-[var(--text-dark)]'}`}>
            {shippingPrice === 0 ? (language === 'ar' ? 'مجاني' : 'FREE') : `${shippingPrice} ${t('products.currency')}`}
          </span>
        </div>
        <div className="flex justify-between text-2xl font-black text-[var(--text-dark)] pt-4 border-t border-[var(--border-color)] mt-2">
          <span className={`uppercase tracking-widest ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>{t('cart.total')}</span>
          <span className="text-[var(--gold-accent)]">{totalPrice.toFixed(0)} <span className="text-sm text-[var(--soft-brown)] font-medium uppercase tracking-widest">{t('products.currency')}</span></span>
        </div>
      </div>

      <button onClick={onCheckout}
        className="w-full bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] h-14 text-sm font-semibold tracking-widest uppercase transition-colors rounded-none mt-6">
        {t('cart.checkout')}
      </button>
    </div>
  );
};

export default Cart;