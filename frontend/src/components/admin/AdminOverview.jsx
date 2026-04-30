import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const AdminOverview = () => {
  const { language } = useLanguage();
  const { token } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const resOrders = await axios.get('http://127.0.0.1:8080/api/orders/', config);
        setOrders(resOrders.data);
        
        const resProducts = await axios.get('http://127.0.0.1:8080/api/products/');
        setProducts(resProducts.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (token) {
        fetchData();
    }
  }, [token]);

  // Total Sales
  const totalSales = orders.reduce((acc, order) => acc + Number(order.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  // Group orders by date for Line Chart
  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
        existing.sales += Number(order.totalPrice || 0);
    } else {
        acc.push({ date, sales: Number(order.totalPrice || 0) });
    }
    return acc;
  }, []);

  // Format inventory for Bar Chart
  const inventoryData = products.map(product => ({
      name: product.name || 'Unknown',
      stock: product.countInStock || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900">{language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSales.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900">{language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900">{language === 'ar' ? 'المبيعات الأخيرة' : 'Recent Sales'}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#d97706" name={language === 'ar' ? 'المبيعات' : 'Sales'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900">{language === 'ar' ? 'مستويات المخزون' : 'Inventory Levels'}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" truncateByToEllipsis={true} tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#b45309" name={language === 'ar' ? 'الكمية المتوفرة' : 'Stock'} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
