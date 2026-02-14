import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import MobileMenu from '../components/MobileMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleCartClick = () => {
    setShowCart(true);
  };
  
  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };
  
  const handleBackToCart = () => {
    setShowCheckout(false);
    setShowCart(true);
  };
  
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onCartClick={handleCartClick}
            onMenuClick={() => setShowMobileMenu(true)}
          />
          
          <MobileMenu 
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
          
          <main>
            <Hero />
            <ProductGrid />
            <AboutSection />
          </main>
          
          <Footer />
          
          <Dialog open={showCart} onOpenChange={setShowCart}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>سلة التسوق</DialogTitle>
              </DialogHeader>
              <Cart onCheckout={handleCheckout} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>إتمام الطلب</DialogTitle>
              </DialogHeader>
              <Checkout onBack={handleBackToCart} />
            </DialogContent>
          </Dialog>
        </div>
      </CartProvider>
    </LanguageProvider>
  );
};

export default Index;
