from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum
from django.utils import timezone

from .serializers import (
    MyTokenObtainPairSerializer, ProductSerializer,
    CategorySerializer, UserSerializer, OrderSerializer, WishlistSerializer,
    GovernorateSerializer
)
from .models import Product, Category, Order, OrderItem, ShippingAddress, Wishlist, Governorate
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

LOW_STOCK_THRESHOLD = 5


# ── Auth ──────────────────────────────────────────────────────────────────────

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        return Response(UserSerializer(user).data)
    except Exception:
        return Response({'detail': 'المستخدم موجود بالفعل'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    return Response(UserSerializer(request.user).data)


# ── Products ──────────────────────────────────────────────────────────────────

class ProductListView(ListAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category___id', 'category__name', 'category__slug']
    search_fields = ['name', 'description', 'brand', 'category__name', 'category__slug']
    ordering_fields = ['price', 'rating', 'createdAt']
    ordering = ['-createdAt']
@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        return Response(ProductSerializer(product).data)
    except Product.DoesNotExist:
        return Response({'detail': 'المنتج غير موجود'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getCategories(request):
    try:
        return Response(CategorySerializer(Category.objects.all(), many=True).data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getGovernorates(request):
    try:
        return Response(GovernorateSerializer(Governorate.objects.all(), many=True).data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def createProduct(request):
    try:
        user = request.user
        product = Product.objects.create(
            user=user, name='New Product', price=0,
            brand='', countInStock=0, description=''
        )
        return Response(ProductSerializer(product).data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateProduct(request, pk):
    try:
        data = request.data
        product = Product.objects.get(_id=pk)
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.brand = data.get('brand', product.brand)
        product.countInStock = data.get('countInStock', product.countInStock)
        product.description = data.get('description', product.description)
        cat_id = data.get('category')
        if cat_id:
            try:
                product.category = Category.objects.get(_id=cat_id)
            except Category.DoesNotExist:
                pass
        product.save()
        return Response(ProductSerializer(product).data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({'detail': 'Product deleted'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getLowStockProducts(request):
    low_stock = Product.objects.filter(countInStock__lte=LOW_STOCK_THRESHOLD)
    return Response(ProductSerializer(low_stock, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getAdminStats(request):
    total_sales = Order.objects.aggregate(total=Sum('totalPrice'))['total'] or 0
    return Response({
        'totalSales': float(total_sales),
        'totalOrders': Order.objects.count(),
        'totalProducts': Product.objects.count(),
        'lowStockCount': Product.objects.filter(countInStock__lte=LOW_STOCK_THRESHOLD).count(),
        'outOfStockCount': Product.objects.filter(countInStock=0).count(),
        'totalUsers': User.objects.count(),
    })


# ── Orders ────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems')

    if not orderItems:
        return Response({'detail': 'السلة فارغة'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        shipping = data.get('shippingAddress', {})
        gov_id = shipping.get('governorate')
        
        # Backend strong validation checks
        address = shipping.get('address', '').strip()
        city = shipping.get('city', '').strip()
        phone = shipping.get('phone', '').strip()
        postalCode = shipping.get('postalCode', '').strip()

        if not address:
            return Response({'detail': 'العنوان التفصيلي مطلوب ولا يمكن أن يكون فارغاً'}, status=status.HTTP_400_BAD_REQUEST)
        if not city:
            return Response({'detail': 'المدينة / المنطقة مطلوبة ولا يمكن أن تكون فارغة'}, status=status.HTTP_400_BAD_REQUEST)
        if not gov_id:
            return Response({'detail': 'يرجى اختيار المحافظة لتحديد مصاريف الشحن'}, status=status.HTTP_400_BAD_REQUEST)
        
        import re
        if not phone:
            return Response({'detail': 'رقم الهاتف مطلوب للتواصل وتأكيد الطلب'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(r'^01[0125]\d{8}$', phone):
            return Response({'detail': 'رقم الهاتف المصري غير صالح (يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015)'}, status=status.HTTP_400_BAD_REQUEST)

        governorate = None
        shipping_price = 0

        try:
            governorate = Governorate.objects.get(_id=gov_id)
            shipping_price = governorate.shipping_cost
        except Governorate.DoesNotExist:
            return Response({'detail': 'المحافظة المختارة غير مسجلة في قاعدة البيانات لدينا'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod', 'Cash on Delivery'),
            taxPrice=data.get('taxPrice', 0),
            shippingPrice=shipping_price,
            totalPrice=data.get('totalPrice', 0),
        )

        ShippingAddress.objects.create(
            order=order,
            address=shipping.get('address', ''),
            city=shipping.get('city', ''),
            governorate=governorate,
            phone=shipping.get('phone', ''),
            postalCode=shipping.get('postalCode', '0000'),
            country=shipping.get('country', 'Egypt'),
        )

        for item in orderItems:
            try:
                product = Product.objects.get(_id=item['product'])
                OrderItem.objects.create(
                    product=product, order=order,
                    name=product.name,
                    qty=item['qty'],
                    price=item['price'],
                    image=str(product.image) if product.image else '',
                )
                if product.countInStock >= item['qty']:
                    product.countInStock -= item['qty']
                    product.save()
            except Product.DoesNotExist:
                pass

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    try:
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-createdAt')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getOrders(request):
    return Response(OrderSerializer(Order.objects.all(), many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isDelivered = True
        order.deliveredAt = timezone.now()
        order.save()
        return Response({'detail': 'Order delivered'})
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()
        return Response({'detail': 'Order marked as paid'})
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateOrder(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        data = request.data
        order.status = data.get('status', order.status)
        order.isPaid = data.get('isPaid', order.isPaid)
        order.isDelivered = data.get('isDelivered', order.isDelivered)
        
        if order.isDelivered and not order.deliveredAt:
            order.deliveredAt = timezone.now()
        if order.isPaid and not order.paidAt:
            order.paidAt = timezone.now()
            
        order.save()
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        # Only admin or the order owner can view it
        if not request.user.is_staff and order.user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


# ── Wishlist ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWishlist(request):
    """Get the authenticated user's wishlist."""
    items = Wishlist.objects.filter(user=request.user).select_related('product', 'product__category')
    return Response(WishlistSerializer(items, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleWishlist(request, product_id):
    """Toggle a product in/out of the authenticated user's wishlist."""
    try:
        product = Product.objects.get(_id=product_id)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user, product=product
    )
    if not created:
        # Already wishlisted → remove it
        wishlist_item.delete()
        return Response({'wishlisted': False, 'detail': 'Removed from wishlist'})

    return Response({'wishlisted': True, 'detail': 'Added to wishlist'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkWishlisted(request, product_id):
    """Check if a product is in the user's wishlist."""
    is_wishlisted = Wishlist.objects.filter(
        user=request.user, product___id=product_id
    ).exists()
    return Response({'wishlisted': is_wishlisted})
