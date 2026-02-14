
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { Order } from '../../types';

const OrdersManagement: React.FC = () => {
  const { language } = useLanguage();
  
  // بيانات وهمية للطلبات
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '001',
      items: [
        {
          id: '1',
          name: { ar: 'عباءة كلاسيكية سوداء', en: 'Classic Black Abaya' },
          description: { ar: 'عباءة أنيقة', en: 'Elegant abaya' },
          price: 299,
          category: 'abayas',
          image: '',
          sizes: ['M'],
          colors: ['أسود'],
          inStock: true,
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'أسود'
        }
      ],
      total: 299,
      paymentMethod: 'bank',
      customerInfo: {
        name: 'فاطمة أحمد',
        email: 'fatima@example.com',
        phone: '01234567890',
        address: 'شارع النصر، المعادي',
        city: 'القاهرة'
      },
      status: 'pending',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '002',
      items: [
        {
          id: '2',
          name: { ar: 'جلباب مطرز بالذهبي', en: 'Gold Embroidered Jilbab' },
          description: { ar: 'جلباب فاخر', en: 'Luxury jilbab' },
          price: 449,
          category: 'jilbabs',
          image: '',
          sizes: ['L'],
          colors: ['بيج'],
          inStock: true,
          quantity: 1,
          selectedSize: 'L',
          selectedColor: 'بيج'
        }
      ],
      total: 449,
      paymentMethod: 'visa',
      customerInfo: {
        name: 'عائشة محمد',
        email: 'aisha@example.com',
        phone: '01098765432',
        address: 'شارع الهرم، الجيزة',
        city: 'الجيزة'
      },
      status: 'confirmed',
      createdAt: new Date('2024-01-16')
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: language === 'ar' ? 'قيد المراجعة' : 'Pending' },
      confirmed: { color: 'bg-blue-500', text: language === 'ar' ? 'مؤكد' : 'Confirmed' },
      shipped: { color: 'bg-orange-500', text: language === 'ar' ? 'تم الشحن' : 'Shipped' },
      delivered: { color: 'bg-green-500', text: language === 'ar' ? 'تم التسليم' : 'Delivered' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      bank: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
      visa: language === 'ar' ? 'فيزا' : 'Visa',
      cod: language === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery'
    };
    return methods[method as keyof typeof methods];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-900">
            {language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'رقم الطلب' : 'Order ID'}</TableHead>
                <TableHead>{language === 'ar' ? 'العميل' : 'Customer'}</TableHead>
                <TableHead>{language === 'ar' ? 'المجموع' : 'Total'}</TableHead>
                <TableHead>{language === 'ar' ? 'طريقة الدفع' : 'Payment'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                <TableHead>{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerInfo.name}</div>
                      <div className="text-sm text-amber-600">{order.customerInfo.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.total} {language === 'ar' ? 'ر.س' : 'SAR'}</TableCell>
                  <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.createdAt.toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
                        </SelectItem>
                        <SelectItem value="confirmed">
                          {language === 'ar' ? 'مؤكد' : 'Confirmed'}
                        </SelectItem>
                        <SelectItem value="shipped">
                          {language === 'ar' ? 'تم الشحن' : 'Shipped'}
                        </SelectItem>
                        <SelectItem value="delivered">
                          {language === 'ar' ? 'تم التسليم' : 'Delivered'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;
