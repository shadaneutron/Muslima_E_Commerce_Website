import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Phone, MapPin, CreditCard, Clock } from 'lucide-react';
import { API } from '@/config';

const OrdersManagement = () => {
  const { language } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get(`${API}/api/orders/`, config);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (token) {
        fetchOrders();
    }
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const updateData = { status: newStatus };
        if (newStatus === 'Delivered') updateData.isDelivered = true;
        
        await axios.put(`${API}/api/orders/${orderId}/update/`, updateData, config);
        
        setOrders(orders.map(order => (order._id === orderId ? { ...order, status: newStatus, isDelivered: newStatus === 'Delivered' } : order)));
        toast({ title: language === 'ar' ? "تم التحديث بنجاح" : "Updated successfully" });
    } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-500', text: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
      'Processing': { color: 'bg-blue-500', text: language === 'ar' ? 'جاري التجهيز' : 'Processing' },
      'Shipped': { color: 'bg-purple-500', text: language === 'ar' ? 'تم الشحن' : 'Shipped' },
      'Delivered': { color: 'bg-green-500', text: language === 'ar' ? 'تم التسليم' : 'Delivered' },
      'Cancelled': { color: 'bg-red-500', text: language === 'ar' ? 'ملغي' : 'Cancelled' },
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6 font-['Cairo']">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
          </CardTitle>
          <Badge variant="outline" className="text-amber-700 border-amber-200">
            {orders.length} {language === 'ar' ? 'طلب' : 'Orders'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-amber-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-amber-50/50">
                <TableRow>
                  <TableHead className="w-[80px]">{language === 'ar' ? 'الطلب' : 'ID'}</TableHead>
                  <TableHead>{language === 'ar' ? 'العميل' : 'Customer'}</TableHead>
                  <TableHead>{language === 'ar' ? 'التواصل' : 'Contact'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الموقع' : 'Location'}</TableHead>
                  <TableHead>{language === 'ar' ? 'المجموع' : 'Total'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className="text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-amber-50/30">
                    <TableCell className="font-bold text-amber-900">#{order._id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-amber-950">{order.user?.first_name || 'Guest'}</span>
                        <span className="text-xs text-amber-600">{order.user?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-amber-800">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-mono">{order.shippingAddress?.phone || '---'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-amber-800">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span className="font-bold">{order.shippingAddress?.governorate_name || '---'}</span>
                        </div>
                        <span className="pr-4">{order.shippingAddress?.city}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-amber-900">{order.totalPrice} ج.م</span>
                        <span className="text-[10px] text-amber-500">{order.paymentMethod === 'Cash on Delivery' ? 'دفع عند الاستلام' : order.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-center">
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => updateOrderStatus(order._id, value)}
                      >
                        <SelectTrigger className="w-32 border-amber-200 focus:ring-amber-500 h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                          <SelectItem value="Processing">{language === 'ar' ? 'جاري التجهيز' : 'Processing'}</SelectItem>
                          <SelectItem value="Shipped">{language === 'ar' ? 'تم الشحن' : 'Shipped'}</SelectItem>
                          <SelectItem value="Delivered">{language === 'ar' ? 'تم التسليم' : 'Delivered'}</SelectItem>
                          <SelectItem value="Cancelled">{language === 'ar' ? 'إلغاء الطلب' : 'Cancelled'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;

