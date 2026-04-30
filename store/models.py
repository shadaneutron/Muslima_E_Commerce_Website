from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)

    def __str__(self):
        return self.name or "Category"


class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(
        upload_to='product_images/',
        null=True,
        blank=True,
        default='placeholder.png'
    )
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    description = models.TextField(null=True, blank=True)

    rating = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        null=True,
        blank=True,
        default=0
    )
    numReviews = models.IntegerField(null=True, blank=True, default=0)

    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or "Product"


class Review(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating}"


class Order(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)

    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self._id}"


class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True
    )

    # ✅ هنا التعديل المهم
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='orderItems',
        null=True,
        blank=True
    )

    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name or "Order Item"


class ShippingAddress(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='shippingAddress'
    )

    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.address or "Shipping Address"
