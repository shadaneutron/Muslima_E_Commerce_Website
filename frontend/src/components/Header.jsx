import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingBag, Heart, Globe, LogOut, User, Menu, X, Search, Moon } from 'lucide-react';
import { API } from '@/config';

const Header = ({ onCartClick }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchParams, searchParamsRef] = useSearchParams();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/api/categories/`);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchVal.trim()) {
      newParams.set('search', searchVal.trim());
    } else {
      newParams.delete('search');
    }
    navigate(`/?${newParams.toString()}#product-grid`);
    setTimeout(() => {
      const grid = document.getElementById('product-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCategorySelect = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryName);
    }
    navigate(`/?${newParams.toString()}#product-grid`);
    setMobileOpen(false);
    setTimeout(() => {
      const grid = document.getElementById('product-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNewArrivals = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', 'new');
    navigate(`/?${newParams.toString()}#product-grid`);
    setMobileOpen(false);
    setTimeout(() => {
      const grid = document.getElementById('product-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textCls = atTop
    ? 'text-[var(--soft-brown)] hover:text-[var(--text-dark)]'
    : 'text-[var(--soft-brown)] hover:text-[var(--text-dark)]';

  const iconBtnCls = `p-2 rounded-xl transition-all duration-200 hover:bg-[var(--primary-beige)]/20 text-[var(--soft-brown)]`;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${atTop ? 'bg-transparent border-transparent' : 'bg-white/90 backdrop-blur-md border-[var(--border-color)] shadow-sm'}`}>
      {/* Announcement Bar */}
      <div className="bg-[var(--text-dark)] text-[var(--primary-beige)] text-xs font-medium py-2 text-center tracking-widest uppercase">
        {language === 'ar' ? 'شحن مجاني للطلبات فوق ١٠٠٠ ج.م' : 'Complimentary shipping on orders over 1000 EGP'}
      </div>

      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu toggle & Search (Left side on Desktop, Left on Mobile) */}
        <div className="flex items-center gap-2 flex-1">
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden ${iconBtnCls}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button onClick={() => setSearchOpen(!searchOpen)} className={`${iconBtnCls} hidden lg:block`}>
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Logo (Center) */}
        <div className="flex-1 text-center flex justify-center">
          <Link
            to="/"
            className={`text-2xl md:text-3xl font-black tracking-widest text-[var(--text-dark)] transition-transform duration-300 hover:scale-105 ${isRTL ? "font-['Cairo']" : "font-['Inter'] uppercase"}`}
          >
            {t('site.name')}
          </Link>
        </div>

        {/* Actions (Right) */}
        <div className="flex items-center justify-end gap-1 flex-1">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className={`${iconBtnCls} font-semibold text-xs uppercase`}
            title={language === 'ar' ? 'English' : 'عربي'}
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Dark Mode selection toggle */}
          <button className={`${iconBtnCls} hidden md:block`}>
            <Moon className="w-5 h-5" />
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/orders" className="text-xs font-semibold px-2 text-[var(--text-dark)] hover:text-[var(--gold-accent)] transition-colors cursor-pointer" title={language === 'ar' ? 'طلباتي' : 'My Orders'}>
                {user.first_name || user.username}
              </Link>
              <button onClick={logout} className={`${iconBtnCls} hover:text-red-600`}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className={`${iconBtnCls} hidden md:block`}>
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className={`${iconBtnCls} relative hidden sm:block`}>
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--gold-accent)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button onClick={onCartClick} className={`${iconBtnCls} relative`}>
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--text-dark)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Navigation (Below header) */}
      <nav className={`hidden lg:flex items-center justify-center gap-10 py-3 border-t border-[var(--border-color)] transition-all ${atTop ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md'}`}>
        <button
          onClick={() => handleCategorySelect('all')}
          className={`font-medium text-sm tracking-wide uppercase relative group cursor-pointer ${textCls}`}
        >
          {language === 'ar' ? 'الكل' : 'All'}
          <span className="absolute -bottom-1 inset-x-0 h-[1px] bg-[var(--gold-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`font-medium text-sm tracking-wide uppercase relative group cursor-pointer ${textCls}`}
          >
            {cat.name}
            <span className="absolute -bottom-1 inset-x-0 h-[1px] bg-[var(--gold-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </button>
        ))}
        <button
          onClick={handleNewArrivals}
          className={`font-medium text-sm tracking-wide uppercase relative group cursor-pointer ${textCls}`}
        >
          {language === 'ar' ? 'الوصول حديثاً' : 'New Arrivals'}
          <span className="absolute -bottom-1 inset-x-0 h-[1px] bg-[var(--gold-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>
      </nav>

      {/* Search Bar Overlay */}
      {searchOpen && (
        <div className="absolute top-full inset-x-0 bg-white shadow-md border-t border-[var(--border-color)] py-6 px-4 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="container mx-auto max-w-2xl relative">
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={language === 'ar' ? 'ابحثي عن منتجات...' : 'Search for products...'} 
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full px-6 py-3 pr-12 focus:outline-none focus:border-[var(--gold-accent)] transition-colors text-[var(--text-dark)]"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--soft-brown)] hover:text-[var(--text-dark)] transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[var(--border-color)] px-6 py-6 shadow-xl animate-fade-in flex flex-col gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'} 
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:border-[var(--gold-accent)] text-[var(--text-dark)]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--soft-brown)]">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => handleCategorySelect('all')}
              className="text-start font-medium text-[var(--text-dark)] text-lg uppercase tracking-wide border-b border-[var(--border-color)] pb-2 cursor-pointer"
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="text-start font-medium text-[var(--text-dark)] text-lg uppercase tracking-wide border-b border-[var(--border-color)] pb-2 cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={handleNewArrivals}
              className="text-start font-medium text-[var(--text-dark)] text-lg uppercase tracking-wide border-b border-[var(--border-color)] pb-2 cursor-pointer"
            >
              {language === 'ar' ? 'الوصول حديثاً' : 'New Arrivals'}
            </button>
            {user ? (
              <Link to="/orders" onClick={() => setMobileOpen(false)}
                className="font-semibold text-[var(--gold-accent)] pt-2 uppercase tracking-wide cursor-pointer"
              >
                {language === 'ar' ? 'طلباتي' : 'My Orders'}
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="font-semibold text-[var(--gold-accent)] pt-2 uppercase tracking-wide"
              >
                {t('nav.login')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;