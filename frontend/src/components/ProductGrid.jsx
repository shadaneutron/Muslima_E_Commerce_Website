import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

const ProductGrid = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await axios.get("http://127.0.0.1:8080/api/products/");
        const resCategories = await axios.get("http://127.0.0.1:8080/api/categories/");
        setProducts(resProducts.data);
        setCategories([{ _id: 'all', name: language === 'ar' ? 'الكل' : 'All' }, ...resCategories.data]);
      } catch (error) {
        console.error("خطأ في الاتصال بالباك أند:", error);
      }
    };
    fetchData();
  }, [language]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="products" className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">{t('products.title')}</h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat._id}
              variant={selectedCategory === cat._id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat._id)}
              className={selectedCategory === cat._id ? "bg-amber-600 text-white" : "border-amber-300 text-amber-700"}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;