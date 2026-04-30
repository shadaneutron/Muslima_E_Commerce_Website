import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Settings } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const ProductsManagement = () => {
  const { language } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    countInStock: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8080/api/products/');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // First create a blank product
        const { data } = await axios.post('http://127.0.0.1:8080/api/products/create/', {}, config);
        
        // Then update it with our values
        await axios.put(`http://127.0.0.1:8080/api/products/update/${data._id}/`, newProduct, config);
        
        toast({ title: language === 'ar' ? "تم الإضافة بنجاح" : "Product added" });
        setShowAddModal(false);
        fetchProducts();
    } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://127.0.0.1:8080/api/products/delete/${productId}/`, config);
            setProducts(products.filter(p => p._id !== productId));
            toast({ title: language === 'ar' ? "تم الحذف بنجاح" : "Product deleted" });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }
  };

  const toggleProductStock = async (productId, currentStock) => {
    const newStock = currentStock > 0 ? 0 : 10;
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://127.0.0.1:8080/api/products/update/${productId}/`, { countInStock: newStock }, config);
        setProducts(products.map(p => (p._id === productId ? { ...p, countInStock: newStock } : p)));
    } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-900">
            {language === 'ar' ? 'إدارة المنتجات' : 'Products Management'}
          </CardTitle>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-amber-900">
                  {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'ar' ? 'اسم المنتج' : 'Product Name'}</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'السعر' : 'Price'}</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>{language === 'ar' ? 'وصف المنتج' : 'Description'}</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'الكمية في المخزن' : 'Stock Count'}</Label>
                  <Input
                    type="number"
                    value={newProduct.countInStock}
                    onChange={(e) => setNewProduct({ ...newProduct, countInStock: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleAddProduct} className="bg-amber-600 hover:bg-amber-700">
                {language === 'ar' ? 'إضافة المنتج' : 'Add Product'}
              </Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'اسم المنتج' : 'Name'}</TableHead>
                <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                <TableHead>{language === 'ar' ? 'المخزون' : 'Stock'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    {product.price} {language === 'ar' ? 'ر.س' : 'SAR'}
                  </TableCell>
                  <TableCell>
                    {product.countInStock}
                  </TableCell>
                  <TableCell>
                    <Badge className={product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}>
                      {product.countInStock > 0 ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => toggleProductStock(product._id, product.countInStock)} className="border-amber-300 text-amber-700 hover:bg-amber-100 mr-2">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product._id)} className="border-red-300 text-red-700 hover:bg-red-100">
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
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

export default ProductsManagement;
