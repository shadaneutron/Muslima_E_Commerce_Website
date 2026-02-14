import React, { useState } from 'react';
import { products } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

const ProductGrid = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: t('products.all') },
    { id: 'abayas', label: t('products.abayas') },
    { id: 'jilbabs', label: t('products.jilbabs') },
    { id: 'hijabs', label: t('products.hijabs') }
  ];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  return (
    <section id="products" className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">{t('products.title')}</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700 hover:bg-amber-100"}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
