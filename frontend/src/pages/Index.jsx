import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '../contexts/LanguageContext';

const Index = () => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] overflow-x-hidden selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]">
      <Header onCartClick={() => setShowCart(true)} />

      <main>
        <Hero />
        {/* You could add a Featured section or Islamic aesthetic banners here before ProductGrid */}
        <ProductGrid />
      </main>

      <Footer />

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--border-color)] shadow-2xl rounded-none p-6 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className="mb-4">
            <DialogTitle className={`text-2xl font-bold text-[var(--text-dark)] uppercase tracking-widest ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('cart.title')}
            </DialogTitle>
            <DialogDescription className="text-[var(--soft-brown)]/60 text-sm font-light uppercase tracking-widest">
              {isRTL ? 'راجعي منتجاتكِ واستمري للدفع' : 'Review your items and proceed to checkout'}
            </DialogDescription>
          </DialogHeader>
          <Cart onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--border-color)] shadow-2xl rounded-none p-6 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className="mb-4">
            <DialogTitle className={`text-2xl font-bold text-[var(--text-dark)] uppercase tracking-widest text-center ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {isRTL ? 'إتمام الطلب' : 'Checkout'}
            </DialogTitle>
          </DialogHeader>
          <Checkout onBack={() => { setShowCheckout(false); setShowCart(true); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;