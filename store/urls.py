from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view()),
    path('users/register/', views.registerUser),
    path('users/profile/', views.getUserProfile),

    path('products/', views.getProducts),
    path('products/<str:pk>/', views.getProduct),
    path('categories/', views.getCategories),

    path('orders/add/', views.addOrderItems),
    path('orders/', views.getOrders),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered),

    path('products/create/', views.createProduct),
    path('products/update/<str:pk>/', views.updateProduct),
    path('products/delete/<str:pk>/', views.deleteProduct),
]
