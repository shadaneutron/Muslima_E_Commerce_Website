import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { API } from '@/config';

const Wishlist = () => {
  const { language, t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { wishlistItems, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const getImg = (product) => {
    if (!product?.image) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=75';
    if (product.image.startsWith('http')) return product.image;
    return `${API}${product.image}`;
  };

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    toast({ title: language === 'ar' ? 'أُزيل من المفضلة' : 'Removed from wishlist' });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 'Standard', 'Default');
    toast({ title: language === 'ar' ? 'تم الإضافة للسلة ✓' : 'Added to cart ✓' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] selection:bg-[var(--gold-accent)] selection:text-[var(--text-dark)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onCartClick={() => {}} />
      <main className="container mx-auto px-4 py-8 pt-32 md:pt-40 max-w-7xl">

        {/* Header */}
        <div className="mb-12 animate-fade-up text-center md:text-start border-b border-[var(--border-color)] pb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
            <h1 className={`text-4xl font-bold text-[var(--text-dark)] tracking-widest uppercase ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('wishlist.title')}
            </h1>
          </div>
          <p className="text-[var(--soft-brown)]/60 text-sm font-semibold tracking-widest uppercase">
            {user
              ? (language === 'ar' ? `${wishlistItems.length} قطعة محفوظة` : `${wishlistItems.length} saved items`)
              : t('wishlist.loginRequired')
            }
          </p>
        </div>

        {/* Not logged in */}
        {!user && (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-20 h-20 bg-[var(--primary-beige)]/10 flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-[var(--gold-accent)]" />
            </div>
            <h2 className={`text-2xl font-semibold text-[var(--text-dark)] mb-4 uppercase tracking-widest ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>{t('wishlist.loginRequired')}</h2>
            <Link to="/login"
              className="inline-block mt-6 bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] px-10 py-4 text-sm font-semibold tracking-widest uppercase transition-colors">
              {t('nav.login')}
            </Link>
          </div>
        )}

        {/* Empty */}
        {user && !loading && wishlistItems.length === 0 && (
          <div className="text-center py-24 animate-scale-in">
            <div className="w-24 h-24 bg-[var(--primary-beige)]/10 flex items-center justify-center mx-auto mb-8 border border-[var(--primary-beige)]/30">
              <Heart className="w-10 h-10 text-[var(--gold-accent)]" />
            </div>
            <h2 className={`text-2xl font-bold text-[var(--text-dark)] mb-3 uppercase tracking-widest ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
              {t('wishlist.empty')}
            </h2>
            <p className="text-[var(--soft-brown)] text-sm mb-8 font-light tracking-widest uppercase">{t('wishlist.emptyHint')}</p>
            <Link to="/" className="inline-block bg-[var(--text-dark)] text-white hover:bg-[var(--soft-brown)] px-10 py-4 text-sm font-semibold tracking-widest uppercase transition-colors">
              {language === 'ar' ? 'تصفحي المتجر' : 'Browse Store'}
            </Link>
          </div>
        )}

        {/* Loading */}
        {user && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-[var(--border-color)]">
                <div className="skeleton h-[350px]" />
                <div className="p-5 space-y-4">
                  <div className="skeleton h-4 w-3/4" /> <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items Grid */}
        {user && !loading && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map(({ id, product }, i) => (
              <div key={id} className="group bg-white border border-[var(--border-color)] hover:shadow-xl transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-[var(--bg-color)]">
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img src={getImg(product)} alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=75'; }}
                    />
                  </Link>
                  <button onClick={() => handleRemove(product._id)}
                    className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur border border-[var(--border-color)] hover:border-red-200 transition-all text-red-500">
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Link to={`/product/${product._id}`}>
                    <h3 className={`font-semibold text-sm text-[var(--text-dark)] mb-2 line-clamp-2 uppercase tracking-wide group-hover:text-[var(--gold-accent)] transition-colors ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className={`text-lg font-bold text-[var(--gold-accent)] mb-5 ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
                    {Number(product.price).toLocaleString()} <span className="text-[10px] font-semibold text-[var(--soft-brown)] uppercase tracking-widest">{t('products.currency')}</span>
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock <= 0}
                      className="flex-grow flex items-center justify-center gap-2 bg-[var(--text-dark)] hover:bg-[var(--soft-brown)] text-white font-semibold text-xs tracking-widest uppercase py-4 transition-colors disabled:opacity-50">
                      <ShoppingBag className="w-4 h-4" />
                      {product.countInStock > 0 ? t('products.addToCart') : t('products.outOfStock')}
                    </button>
                    <button onClick={() => handleRemove(product._id)}
                      className="p-4 border border-[var(--border-color)] text-[var(--soft-brown)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                      title={language === 'ar' ? 'حذف' : 'Remove'}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <div className="mt-24"><Footer /></div>
    </div>
  );
};

export default Wishlist;
