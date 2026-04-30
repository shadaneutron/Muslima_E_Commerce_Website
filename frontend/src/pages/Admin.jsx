import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OrdersManagement from '../components/admin/OrdersManagement';
import ProductsManagement from '../components/admin/ProductsManagement';
import SiteSettings from '../components/admin/SiteSettings';
import AdminOverview from '../components/admin/AdminOverview';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      alert(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-amber-900">
              {language === 'ar' ? 'تسجيل دخول المسئول' : 'Admin Login'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
              className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-400"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <input
              type="password"
              placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
              className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-400"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button onClick={handleLogin} className="w-full bg-amber-600 hover:bg-amber-700">
              {language === 'ar' ? 'دخول' : 'Login'}
            </Button>
            <p className="text-sm text-amber-700 text-center">
              {language === 'ar' ? 'المستخدم: admin | كلمة المرور: admin123' : 'Username: admin | Password: admin123'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="bg-white border-b border-amber-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'العودة للموقع' : 'Back to Site'}
            </Button>
            <h1 className="text-2xl font-bold text-amber-900">
              {language === 'ar' ? 'لوحة تحكم مُسلمة' : 'Muslima Admin Panel'}
            </h1>
          </div>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-amber-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              {language === 'ar' ? 'الطلبات' : 'Orders'}
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              {language === 'ar' ? 'المنتجات' : 'Products'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>
          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <LanguageProvider>
      <CartProvider>
        <AdminDashboard />
      </CartProvider>
    </LanguageProvider>
  );
};

export default Admin;
