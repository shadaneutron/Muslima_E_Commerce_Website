from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product, Category, Order, OrderItem, ShippingAddress, Wishlist, Governorate


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['id'] = self.user.id
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name']


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='_id', read_only=True)

    class Meta:
        model = Category
        fields = ['id', '_id', 'name', 'slug', 'image']


class SmartImageField(serializers.Field):
    """Returns the image as a raw URL if it starts with http, else uses the default image URL."""
    def to_representation(self, value):
        if not value:
            return None
        name = str(value.name) if hasattr(value, 'name') else str(value)
        if name.startswith('http://') or name.startswith('https://'):
            return name
        # Standard file-based image
        if value:
            request = self.context.get('request')
            url = value.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def to_internal_value(self, data):
        return data


class ProductSerializer(serializers.ModelSerializer):
    image = SmartImageField(required=False, allow_null=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class GovernorateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Governorate
        fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):
    governorate_name = serializers.CharField(source='governorate.name', read_only=True)

    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
        
        # If it's already an absolute URL
        if obj.image.startswith('http://') or obj.image.startswith('https://'):
            return obj.image
            
        # Clean relative path
        path = obj.image
        if not path.startswith('/media/') and not path.startswith('media/'):
            path = f"/media/{path}"
        elif path.startswith('media/'):
            path = f"/{path}"
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(path)
        return path


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        return OrderItemSerializer(obj.orderItems.all(), many=True).data

    def get_shippingAddress(self, obj):
        try:
            return ShippingAddressSerializer(obj.shippingAddress, many=False).data
        except:
            return None

    def get_user(self, obj):
        return UserSerializer(obj.user, many=False).data


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True, source='product.pk')

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'addedAt']
