import React, { useState } from 'react';
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
import { products as initialProducts } from '../../data/products';
import { Plus, Settings } from 'lucide-react';

const ProductsManagement = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    price: 0,
    category: 'abayas',
    image: '',
    sizes: [],
    colors: [],
    inStock: true,
  });

  const handleAddProduct = () => {
    if (newProduct.name?.ar && newProduct.name?.en && newProduct.price) {
      const product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description || { ar: '', en: '' },
        price: newProduct.price,
        category: newProduct.category || 'abayas',
        image: newProduct.image || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        sizes: newProduct.sizes || ['S', 'M', 'L', 'XL'],
        colors: newProduct.colors || ['أسود'],
        inStock: newProduct.inStock || true,
      };
      setProducts([...products, product]);
      setNewProduct({
        name: { ar: '', en: '' },
        description: { ar: '', en: '' },
        price: 0,
        category: 'abayas',
        image: '',
        sizes: [],
        colors: [],
        inStock: true,
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const toggleProductStock = (productId) => {
    setProducts(products.map(p => (p.id === productId ? { ...p, inStock: !p.inStock } : p)));
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
                  <Label>{language === 'ar' ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}</Label>
                  <Input
                    value={newProduct.name?.ar || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: { ...newProduct.name, ar: e.target.value, en: newProduct.name?.en || '' },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}</Label>
                  <Input
                    value={newProduct.name?.en || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: { ...newProduct.name, en: e.target.value, ar: newProduct.name?.ar || '' },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'وصف المنتج (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea
                    value={newProduct.description?.ar || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: { ...newProduct.description, ar: e.target.value, en: newProduct.description?.en || '' },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'وصف المنتج (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea
                    value={newProduct.description?.en || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: { ...newProduct.description, en: e.target.value, ar: newProduct.description?.ar || '' },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'السعر' : 'Price'}</Label>
                  <Input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'التصنيف' : 'Category'}</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abayas">{language === 'ar' ? 'عباءات' : 'Abayas'}</SelectItem>
                      <SelectItem value="jilbabs">{language === 'ar' ? 'جلابيب' : 'Jilbabs'}</SelectItem>
                      <SelectItem value="hijabs">{language === 'ar' ? 'حجابات' : 'Hijabs'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>{language === 'ar' ? 'رابط الصورة' : 'Image URL'}</Label>
                  <Input value={newProduct.image || ''} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} placeholder="https://example.com/image.jpg" />
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
                <TableHead>{language === 'ar' ? 'الصورة' : 'Image'}</TableHead>
                <TableHead>{language === 'ar' ? 'اسم المنتج' : 'Name'}</TableHead>
                <TableHead>{language === 'ar' ? 'التصنيف' : 'Category'}</TableHead>
                <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image} alt={product.name[language]} className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name[language]}</div>
                    <div className="text-sm text-amber-600">{product.description[language]}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-amber-300 text-amber-700">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.price} {language === 'ar' ? 'ر.س' : 'SAR'}
                  </TableCell>
                  <TableCell>
                    <Badge className={product.inStock ? 'bg-green-500' : 'bg-red-500'}>
                      {product.inStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => toggleProductStock(product.id)} className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)} className="border-red-300 text-red-700 hover:bg-red-100">
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
