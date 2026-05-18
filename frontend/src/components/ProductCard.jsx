import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Eye, Heart, Star, Package } from 'lucide-react';
import { API } from '@/config';

const FALLBACK = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80';

const ProductCard = memo(({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [imgErr, setImgErr] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const getImg = () => {
    if (!product.image || imgErr) return FALLBACK;
    const src = product.image;
    if (src.startsWith('http')) return src;
    return `${API}${src}`;
  };

  const wishlisted = isWishlisted(product._id);
  const isLow = product.countInStock > 0 && product.countInStock <= 5;
  const isOut = product.countInStock <= 0;
  const isFreeShip = product.price >= 1000;

  const handleCart = () => {
    if (isOut) return;
    addToCart(product, 'Standard', 'Default');
    toast({ title: language === 'ar' ? 'تم الإضافة للسلة ✓' : 'Added to cart ✓' });
  };

  const handleWishlist = async () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    const res = await toggleWishlist(product._id);
    if (res?.requiresAuth) {
      toast({ title: t('detail.loginRequired'), variant: 'destructive' });
    }
  };

  return (
    <div className="group h-full flex flex-col bg-[var(--card-bg)] border border-transparent hover:border-[var(--border-color)] transition-all duration-500 hover:shadow-xl rounded-none">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[var(--bg-color)]">
        <img
          src={getImg()}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 start-4 z-10 p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-sm ${wishlisted ? 'active' : ''} ${heartAnim ? 'animate-heart-pop' : ''}`}
          title={wishlisted ? t('products.wishlist.remove') : t('products.wishlist.add')}
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[var(--gold-accent)] text-[var(--gold-accent)]' : 'text-[var(--soft-brown)]'}`} />
        </button>

        {/* Top-right badges */}
        <div className="absolute top-4 end-4 flex flex-col gap-2 z-10">
          {isOut && (
            <span className="bg-[var(--text-dark)] text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow tracking-widest uppercase">
              {t('products.outOfStock')}
            </span>
          )}
          {isLow && !isOut && (
            <span className="bg-[var(--soft-brown)]/90 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow tracking-widest uppercase flex items-center gap-1 backdrop-blur-sm">
              <Package className="w-3 h-3" />
              {t('products.lowStock', { count: product.countInStock })}
            </span>
          )}
          {isFreeShip && (
            <span className="bg-[#4D5A4B]/90 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow tracking-widest uppercase backdrop-blur-sm">
              {t('products.freeShipping')}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="absolute bottom-4 start-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm shadow-sm z-10">
            <Star className="w-3 h-3 fill-[var(--gold-accent)] text-[var(--gold-accent)]" />
            <span className="text-[11px] font-bold text-[var(--text-dark)]">{product.rating}</span>
          </div>
        )}

        {/* Category pill */}
        {product.category?.name && (
          <div className="absolute bottom-4 end-4 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[var(--soft-brown)] px-3 py-1 rounded-sm shadow-sm tracking-widest uppercase">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Hover overlay Actions */}
        <div className="absolute inset-0 bg-[var(--text-dark)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-center gap-3 z-20">
          <button
            onClick={handleCart}
            disabled={isOut}
            className="flex-1 flex justify-center items-center gap-2 bg-[var(--text-dark)] text-white font-semibold text-xs px-4 py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--soft-brown)] transition-colors uppercase tracking-widest"
          >
            <ShoppingBag className="w-4 h-4" />
            {isOut ? t('products.outOfStock') : t('products.addToCart')}
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex justify-center items-center bg-white text-[var(--text-dark)] hover:bg-[var(--primary-beige)] p-3 shadow-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-grow text-center">
        <h3 className={`font-semibold text-lg text-[var(--text-dark)] leading-snug mb-2 line-clamp-1 ${language === 'ar' ? "font-['Cairo']" : "font-['Inter']"}`}>
          {product.name}
        </h3>
        <p className="text-[var(--soft-brown)] text-sm leading-relaxed line-clamp-2 mb-4 flex-grow opacity-80 font-light">
          {product.description}
        </p>
        <div className="mt-auto">
          <span className={`text-xl font-bold text-[var(--gold-accent)] ${language === 'ar' ? "font-['Cairo']" : "font-['Inter']"}`}>
            {Number(product.price).toLocaleString()}
          </span>
          <span className="text-xs text-[var(--soft-brown)] ms-1 font-medium tracking-widest uppercase">{t('products.currency')}</span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;