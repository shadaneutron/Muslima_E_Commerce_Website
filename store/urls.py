from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('users/login/', views.MyTokenObtainPairView.as_view()),
    path('users/register/', views.registerUser),
    path('users/profile/', views.getUserProfile),

    # Products (specific paths BEFORE generic <pk>)
    path('products/', views.ProductListView.as_view()),
    path('products/create/', views.createProduct),
    path('products/low-stock/', views.getLowStockProducts),
    path('products/update/<str:pk>/', views.updateProduct),
    path('products/delete/<str:pk>/', views.deleteProduct),
    path('products/<str:pk>/', views.getProduct),

    # Categories & Governorates
    path('categories/', views.getCategories),
    path('governorates/', views.getGovernorates),

    # Orders
    path('orders/add/', views.addOrderItems),
    path('orders/myorders/', views.getMyOrders),
    path('orders/', views.getOrders),
    path('orders/<str:pk>/', views.getOrderById),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid),
    path('orders/<str:pk>/update/', views.updateOrder),

    # Wishlist (requires auth)
    path('wishlist/', views.getWishlist),
    path('wishlist/<int:product_id>/', views.toggleWishlist),
    path('wishlist/check/<int:product_id>/', views.checkWishlisted),

    # Admin stats
    path('admin/stats/', views.getAdminStats),
]
