from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    MyTokenObtainPairSerializer, ProductSerializer,
    CategorySerializer, UserSerializer, OrderSerializer
)
from .models import Product, Category, Order, OrderItem, ShippingAddress


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
    except:
        return Response({'detail': 'المستخدم موجود بالفعل'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
def getProducts(request):
    return Response(ProductSerializer(Product.objects.all(), many=True).data)


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        return Response(ProductSerializer(product).data)
    except:
        return Response({'detail': 'المنتج غير موجود'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getCategories(request):
    return Response(CategorySerializer(Category.objects.all(), many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems')

    if not orderItems:
        return Response({'detail': 'السلة فارغة'}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(
        user=user,
        paymentMethod=data.get('paymentMethod'),
        taxPrice=data.get('taxPrice'),
        shippingPrice=data.get('shippingPrice'),
        totalPrice=data.get('totalPrice')
    )

    shipping = data.get('shippingAddress')
    ShippingAddress.objects.create(
        order=order,
        address=shipping.get('address'),
        city=shipping.get('city'),
        postalCode=shipping.get('postalCode'),
        country=shipping.get('country')
    )

    for item in orderItems:
        product = Product.objects.get(_id=item['product'])

        OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item['qty'],
            price=item['price'],
            image=product.image.url if product.image else ''
        )

        product.countInStock -= item['qty']
        product.save()

    return Response(OrderSerializer(order).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    return Response(OrderSerializer(orders, many=True).data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateOrderToDelivered(request, pk):
    from django.utils import timezone
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = timezone.now()
    # update status mapping for frontend compatibility
    order.status = 'delivered' # if status was added
    order.save()
    return Response('Order was delivered')

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        description=''
    )
    return Response(ProductSerializer(product).data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.brand = data.get('brand', product.brand)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.description = data.get('description', product.description)
    
    # Handle category update
    cat_id = data.get('category')
    if cat_id:
        try:
            category = Category.objects.get(_id=cat_id)
            product.category = category
        except Category.DoesNotExist:
            pass

    product.save()

    return Response(ProductSerializer(product).data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')
