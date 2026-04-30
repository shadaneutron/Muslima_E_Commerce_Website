from django.contrib import admin
from .models import Product, Category, Order, OrderItem, ShippingAddress, Review

# تخصيص عرض الأقسام - تم تعديل id إلى _id
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name'] 

# تخصيص عرض المنتجات
class ProductAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'price', 'category', 'countInStock']
    list_filter = ['category', 'createdAt']
    search_fields = ['name', 'description']

# تخصيص عرض الطلبات
class OrderAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user', 'totalPrice', 'isPaid', 'createdAt']
    list_filter = ['isPaid', 'createdAt']

# تسجيل الموديلات في لوحة التحكم
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Review)