import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // تأكدي من البورت 8080 كما حددنا في الباك أند
        const { data } = await axios.get(`http://127.0.0.1:8080/api/products/${id}/`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("خطأ في جلب المنتج:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl font-bold text-amber-900 animate-pulse">جاري تحميل المنتج...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">عذراً، المنتج غير موجود</h2>
        <Button onClick={() => navigate('/')} className="bg-amber-600">العودة للمتجر</Button>
      </div>
    );
  }

  const imageUrl = product.image ? `http://127.0.0.1:8080${product.image}` : '/products/placeholder.svg';

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 text-amber-900">
          {language === 'ar' ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <img src={imageUrl} alt={product.name} className="w-full h-[500px] object-cover" />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-amber-600 mb-6">{product.price} {t('products.price')}</p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>
            
            <Button 
              size="lg" 
              onClick={() => {
                addToCart(product, 'Standard', 'Default');
                toast({ title: t('products.added') });
              }}
              disabled={product.countInStock <= 0}
              className="bg-amber-600 hover:bg-amber-700 text-white h-14 text-lg"
            >
              <ShoppingBag className="ml-2 h-5 w-5" />
              {product.countInStock > 0 ? t('products.addToCart') : t('products.outOfStock')}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;