import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API } from '@/config';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle, CheckCircle
} from 'lucide-react';

const AdminOverview = () => {
  const { language } = useLanguage();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resOrders, resProducts, resStats, resLowStock] = await Promise.all([
          axios.get(`${API}/api/orders/`, config),
          axios.get(`${API}/api/products/`),
          axios.get(`${API}/api/admin/stats/`, config).catch(() => ({ data: null })),
          axios.get(`${API}/api/products/low-stock/`, config).catch(() => ({ data: [] })),
        ]);

        setOrders(resOrders.data);
        setProducts(resProducts.data.results || resProducts.data);
        setStats(resStats.data);
        setLowStockProducts(resLowStock.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Derived stats (fallback if /admin/stats/ isn't available)
  const totalSales = stats?.totalSales ?? orders.reduce((acc, o) => acc + Number(o.totalPrice || 0), 0);
  const totalOrders = stats?.totalOrders ?? orders.length;
  const totalProducts = stats?.totalProducts ?? products.length;
  const lowStockCount = stats?.lowStockCount ?? lowStockProducts.length;
  const totalUsers = stats?.totalUsers ?? 0;

  // Sales chart data
  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.sales += Number(order.totalPrice || 0);
    } else {
      acc.push({ date, sales: Number(order.totalPrice || 0) });
    }
    return acc;
  }, []);

  // Inventory chart data
  const inventoryData = products.slice(0, 10).map(product => ({
    name: (product.name || 'Unknown').substring(0, 12),
    stock: product.countInStock || 0,
    isLow: (product.countInStock || 0) <= 5,
  }));

  const statCards = [
    {
      label: language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales',
      value: `${totalSales.toFixed(0)} ${language === 'ar' ? 'ج.م' : 'EGP'}`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'from-amber-50 to-orange-50',
    },
    {
      label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      gradient: 'from-[#B45309] to-[#92400E]',
      bg: 'from-orange-50 to-amber-50',
    },
    {
      label: language === 'ar' ? 'المنتجات' : 'Products',
      value: totalProducts,
      icon: Package,
      gradient: 'from-[#451A03] to-[#6B2D0A]',
      bg: 'from-amber-50 to-stone-50',
    },
    {
      label: language === 'ar' ? 'مخزون منخفض' : 'Low Stock',
      value: lowStockCount,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      bg: 'from-red-50 to-orange-50',
      isAlert: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-fade-up">
          <div className="low-stock-badge text-base px-3 py-1.5">
            <AlertTriangle className="w-4 h-4" />
            {lowStockCount}
          </div>
          <p className="text-red-800 font-bold text-sm">
            {language === 'ar'
              ? `تنبيه: ${lowStockCount} منتج بمخزون منخفض (5 قطع أو أقل) — راجعي المخزون`
              : `Alert: ${lowStockCount} product(s) with low stock (5 units or less) — review inventory`
            }
          </p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`admin-stat-card bg-gradient-to-br ${card.bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#78350F] text-sm font-semibold mb-1">{card.label}</p>
                  <p className={`text-3xl font-extrabold font-['Tajawal'] ${card.isAlert && lowStockCount > 0 ? 'text-red-600' : 'text-[#451A03]'}`}>
                    {card.value}
                    {card.isAlert && lowStockCount > 0 && (
                      <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-amber-100 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#451A03] text-lg font-bold font-['Tajawal'] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#B45309]" />
              {language === 'ar' ? 'مخطط المبيعات' : 'Sales Chart'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78350F' }} />
                <YAxis tick={{ fontSize: 11, fill: '#78350F' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #FDE68A', background: '#FDFBF9' }}
                  labelStyle={{ color: '#451A03', fontWeight: 700 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#B45309"
                  strokeWidth={2.5}
                  dot={{ fill: '#B45309', r: 4 }}
                  activeDot={{ r: 6, fill: '#D97706' }}
                  name={language === 'ar' ? 'المبيعات' : 'Sales'}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Chart */}
        <Card className="border-amber-100 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#451A03] text-lg font-bold font-['Tajawal'] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#B45309]" />
              {language === 'ar' ? 'مستويات المخزون' : 'Inventory Levels'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78350F' }} />
                <YAxis tick={{ fontSize: 11, fill: '#78350F' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #FDE68A', background: '#FDFBF9' }}
                  labelStyle={{ color: '#451A03', fontWeight: 700 }}
                />
                <Bar
                  dataKey="stock"
                  name={language === 'ar' ? 'المخزون' : 'Stock'}
                  radius={[6, 6, 0, 0]}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.isLow ? '#DC2626' : '#B45309'} opacity={entry.isLow ? 1 : 0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products Table */}
      {lowStockProducts.length > 0 && (
        <Card className="border-red-100 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 text-lg font-bold font-['Tajawal'] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {language === 'ar' ? 'منتجات تحتاج إعادة تخزين' : 'Products Needing Restock'}
              <span className="low-stock-badge mr-2">{lowStockProducts.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 bg-red-50/60 border border-red-100 rounded-xl"
                >
                  <div>
                    <p className="font-bold text-[#451A03] text-sm font-['Tajawal']">{product.name}</p>
                    <p className="text-xs text-[#78350F] opacity-70">{product.category?.name || '—'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#B45309]">{product.price} ج.م</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.countInStock === 0
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {product.countInStock === 0
                        ? (language === 'ar' ? 'نفذت' : 'Out')
                        : `${product.countInStock} ${language === 'ar' ? 'قطعة' : 'left'}`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Good Banner */}
      {lowStockProducts.length === 0 && !loading && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-bold text-sm">
            {language === 'ar' ? 'جميع المنتجات بمستويات مخزون جيدة' : 'All products have healthy stock levels'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
