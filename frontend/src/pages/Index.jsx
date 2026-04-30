import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import MobileMenu from '../components/MobileMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Index = () => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <Header 
        onCartClick={() => setShowCart(true)}
        onMenuClick={() => setShowMobileMenu(true)}
      />
      
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      
      <main>
        <Hero />
        <ProductGrid />
        <AboutSection />
      </main>
      
      <Footer />
      
      {/* سلة التسوق */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#451a03]">سلة المشتريات</DialogTitle>
            <DialogDescription className="text-amber-700">راجعي منتجاتكِ المختارة قبل الانتقال للدفع</DialogDescription>
          </DialogHeader>
          <Cart onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />
        </DialogContent>
      </Dialog>
      
      {/* إتمام الطلب */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#451a03]">إتمام الطلب</DialogTitle>
            <DialogDescription className="text-amber-700">أدخلي بيانات الشحن لتأكيد الأوردر</DialogDescription>
          </DialogHeader>
          <Checkout onBack={() => { setShowCheckout(false); setShowCart(true); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;