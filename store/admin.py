from django.contrib import admin
from .models import Product, Category, Order, OrderItem, ShippingAddress, Review, Governorate

class GovernorateAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'shipping_cost']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class ProductAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'price', 'category', 'countInStock']
    list_filter = ['category', 'createdAt']
    search_fields = ['name', 'description']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    can_delete = False

class OrderAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user', 'status', 'totalPrice', 'isPaid', 'isDelivered', 'createdAt']
    list_filter = ['status', 'isPaid', 'isDelivered', 'createdAt']
    inlines = [OrderItemInline, ShippingAddressInline]
    list_editable = ['status', 'isPaid', 'isDelivered']
    search_fields = ['user__username', 'user__email', '_id']
    ordering = ['-createdAt']

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Governorate, GovernorateAdmin)
admin.site.register(Review)

admin.site.site_header = "دار مُسلمة للأزياء الراقية — لوحة التحكم"
admin.site.site_title = "مُسلمة بوتيك"
admin.site.index_title = "إدارة المنتجات والمبيعات"