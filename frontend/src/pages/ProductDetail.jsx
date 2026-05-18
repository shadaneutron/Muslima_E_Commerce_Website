import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft, ShoppingBag, Heart, Package, Star, Truck } from 'lucide-react';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { API } from '@/config';

/** CSS-based image magnifier — no external library */
const ImageMagnifier = ({ src, alt }) => {
  const containerRef = useRef(null);
  const [zooming, setZooming] = useState(false);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2);
    containerRef.current.style.setProperty('--zoom-x', `${x}%`);
    containerRef.current.style.setProperty('--zoom-y', `${y}%`);
  };

  return (
    <div
      ref={containerRef}
      className={`img-zoom-container h-[500px] md:h-[650px] bg-[var(--card-bg)] border border-[var(--border-color)] p-4 ${zooming ? 'zooming' : ''}`}
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="zoom-hint text-[var(--soft-brown)] font-semibold tracking-widest uppercase">🔍 تكبير</div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/api/products/${id}/`);
        setProduct(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)]">
        <Header onCartClick={() => setShowCart(true)} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--gold-accent)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--soft-brown)] font-semibold animate-pulse tracking-widest uppercase">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-red-600 mb-6 uppercase tracking-widest">{t('common.error')}</p>
        <button onClick={() => navigate('/')} className="bg-[var(--text-dark)] text-white px-8 py-4 font-semibold uppercase tracking-widest hover:bg-[var(--soft-brown)] transition-colors">
          {isRTL ? 'العودة للمتجر' : 'Back to Store'}
        </button>
      </div>
    );
  }

  const getImg = () => {
    if (!product.image) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85';
    if (product.image.startsWith('http')) return product.image;
    return `${API}${product.image}`;
  };

  const isOut = product.countInStock <= 0;
  const isLow = product.countInStock > 0 && product.countInStock <= 5;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    if (isOut) return;
    addToCart(product, 'Standard', 'Default');
    toast({ title: language === 'ar' ? 'تم إضافة المنتج للسلة ✓' : 'Added to cart ✓' });
  };

  const handleWishlist = async () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    const res = await toggleWishlist(product._id);
    if (res?.requiresAuth) {
      toast({ title: t('detail.loginRequired'), variant: 'destructive' });
    } else {
      toast({ title: wishlisted
        ? (language === 'ar' ? 'أُزيل من المفضلة' : 'Removed from wishlist')
        : (language === 'ar' ? 'أُضيف للمفضلة ❤' : 'Added to wishlist ❤')
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onCartClick={() => setShowCart(true)} />

      <main className="container mx-auto px-4 py-8 pt-32 md:pt-40">
        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[var(--soft-brown)] hover:text-[var(--gold-accent)] mb-10 font-semibold tracking-widest uppercase transition-colors group">
          {isRTL
            ? <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl-flip" />
            : <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          }
          {t('detail.back')}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* Image with CSS Zoom */}
          <div className="animate-fade-in relative group">
            <ImageMagnifier src={getImg()} alt={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center animate-fade-up">
            {/* Category breadcrumb */}
            {product.category?.name && (
              <p className="text-[var(--gold-accent)] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                {product.category.name}
              </p>
            )}

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-6 leading-tight uppercase tracking-wide ${
              isRTL ? "font-['Cairo']" : "font-['Inter']"
            }`}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-[var(--gold-accent)] text-[var(--gold-accent)]' : 'text-[var(--border-color)]'}`} />
                ))}
                <span className="text-xs text-[var(--soft-brown)] uppercase tracking-widest">({product.numReviews} {isRTL ? 'تقييم' : 'reviews'})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className={`text-4xl font-bold text-[var(--gold-accent)] ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
                {Number(product.price).toLocaleString()}
              </span>
              <span className="text-sm text-[var(--soft-brown)] font-semibold uppercase tracking-widest">{t('products.currency')}</span>
              {product.price >= 1000 && (
                <span className="ms-4 bg-[var(--primary-beige)]/20 text-[var(--text-dark)] text-xs font-semibold px-3 py-1 border border-[var(--primary-beige)] uppercase tracking-widest">
                  {t('products.freeShipping')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--soft-brown)] text-base leading-relaxed mb-8 font-light max-w-lg">
              {product.description}
            </p>

            {/* Stock Indicator */}
            <div className={`flex items-center gap-3 mb-8 text-xs font-semibold uppercase tracking-widest ${
              isOut ? 'text-red-500' : isLow ? 'text-[var(--gold-accent)]' : 'text-[#4D5A4B]'
            }`}>
              <Package className="w-4 h-4" />
              {isOut
                ? t('products.outOfStock')
                : isLow
                  ? t('products.lowStock', { count: product.countInStock })
                  : t('products.inStock')
              }
            </div>

            {/* Shipping note */}
            <div className="flex items-center gap-3 text-xs text-[var(--soft-brown)] font-medium tracking-widest uppercase mb-10 pb-10 border-b border-[var(--border-color)]">
              <Truck className="w-4 h-4 text-[var(--gold-accent)]" />
              {product.price >= 1000
                ? (isRTL ? 'شحن مجاني لهذا المنتج' : 'Free shipping for this item')
                : (isRTL ? 'أضيفي 50 ج.م للشحن • مجاني فوق 1000 ج.م' : '+50 EGP shipping • Free over 1000 EGP')
              }
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOut}
                className="flex-grow bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] h-16 text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {isOut ? t('products.outOfStock') : t('detail.addToCart')}
              </button>
              <button
                onClick={handleWishlist}
                className={`h-16 w-16 border flex items-center justify-center transition-all ${
                  wishlisted
                    ? 'border-red-200 bg-red-50/50'
                    : 'border-[var(--border-color)] hover:border-[var(--gold-accent)] bg-white'
                } ${heartAnim ? 'animate-heart-pop' : ''}`}
                title={wishlisted ? t('detail.wishlisted') : t('detail.wishlist')}
              >
                <Heart className={`w-6 h-6 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--soft-brown)]'}`} />
              </button>
            </div>
            
            {/* Wishlist label */}
            <p className="text-[10px] text-[var(--soft-brown)]/60 mt-3 text-end uppercase tracking-widest font-semibold pr-2">
              {wishlisted ? t('detail.wishlisted') : t('detail.wishlist')}
            </p>
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
};

export default ProductDetail;