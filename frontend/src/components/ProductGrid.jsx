import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { API } from '@/config';

const SkeletonCard = () => (
  <div className="bg-white border border-[var(--border-color)] overflow-hidden">
    <div className="skeleton aspect-[3/4]" />
    <div className="p-5 space-y-4">
      <div className="skeleton h-6 w-3/4 mx-auto" />
      <div className="skeleton h-4 w-full mx-auto" />
      <div className="skeleton h-4 w-2/3 mx-auto" />
      <div className="skeleton h-6 w-1/3 mx-auto mt-4" />
    </div>
  </div>
);

const ProductGrid = () => {
  const { language, t, isRTL } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = {};

      if (searchQuery.trim()) {
        queryParams.search = searchQuery.trim();
      }

      if (active === 'new') {
        queryParams.ordering = '-createdAt';
      } else if (active !== 'all') {
        queryParams.category__slug = active;
      }

      const { data } = await axios.get(`${API}/api/products/`, { params: queryParams });
      setProducts(data.results || data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [active, searchQuery]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

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

  const handleTabChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', key);
    }
    setSearchParams(newParams);
  };

  const filtered = products;

  return (
    <section id="product-grid" className="py-24 px-4 bg-[var(--bg-color)] relative">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="w-12 h-[1px] bg-[var(--gold-accent)] opacity-50"></span>
            <Sparkles className="w-4 h-4 text-[var(--gold-accent)]" />
            <span className="w-12 h-[1px] bg-[var(--gold-accent)] opacity-50"></span>
          </div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-dark)] mb-6 ${isRTL ? "font-['Cairo']" : "font-['Inter'] uppercase tracking-widest"}`}>
            {t('products.title')}
          </h2>
          <p className="text-[var(--soft-brown)] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          <button
            onClick={() => handleTabChange('all')}
            className={`relative px-2 py-2 font-medium tracking-widest uppercase transition-colors duration-300 ${
              active === 'all' ? 'text-[var(--text-dark)]' : 'text-[var(--soft-brown)]/60 hover:text-[var(--soft-brown)]'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
            <span 
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--gold-accent)] transition-all duration-300 ease-out ${
                active === 'all' ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </button>

          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => handleTabChange(c.slug)}
              className={`relative px-2 py-2 font-medium tracking-widest uppercase transition-colors duration-300 ${
                active === c.slug ? 'text-[var(--text-dark)]' : 'text-[var(--soft-brown)]/60 hover:text-[var(--soft-brown)]'
              }`}
            >
              {c.name}
              <span 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--gold-accent)] transition-all duration-300 ease-out ${
                  active === c.slug ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}

          <button
            onClick={() => handleTabChange('new')}
            className={`relative px-2 py-2 font-medium tracking-widest uppercase transition-colors duration-300 ${
              active === 'new' ? 'text-[var(--text-dark)]' : 'text-[var(--soft-brown)]/60 hover:text-[var(--soft-brown)]'
            }`}
          >
            {language === 'ar' ? 'الوصل حديثاً' : 'New'}
            <span 
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--gold-accent)] transition-all duration-300 ease-out ${
                active === 'new' ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-6 text-[var(--soft-brown)]">⚠️</div>
            <p className="text-[var(--text-dark)] font-semibold text-lg mb-6">{t('common.error')}</p>
            <button
              onClick={loadProducts}
              className="inline-flex items-center justify-center gap-2 bg-[var(--text-dark)] text-white px-8 py-3 font-semibold uppercase tracking-widest hover:bg-[var(--soft-brown)] transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white/50 border border-[var(--border-color)] mt-8">
                <div className="text-5xl mb-6 text-[var(--soft-brown)] opacity-50">🛍️</div>
                <p className={`text-[var(--soft-brown)] text-xl font-medium ${isRTL ? "font-['Cairo']" : "font-['Inter']"}`}>
                  {t('products.empty')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((p, i) => (
                  <div
                    key={p._id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
            <p className="text-center text-[var(--soft-brown)]/70 text-sm mt-16 font-light tracking-widest uppercase">
              {language === 'ar' ? `عرض ${filtered.length} منتج` : `Showing ${filtered.length} products`}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;