from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Category(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)
    slug = models.SlugField(max_length=200, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

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


class Governorate(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, unique=True)
    shipping_cost = models.DecimalField(max_digits=7, decimal_places=2, default=50.00)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    paymentMethod = models.CharField(max_length=200, null=True, blank=True, default='Cash on Delivery')
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)

    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self._id} ({self.status})"


class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True
    )

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
    governorate = models.ForeignKey(Governorate, on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True, default='Egypt')

    def __str__(self):
        return f"{self.address}, {self.governorate.name if self.governorate else ''}"


class Wishlist(models.Model):
    """A per-user wishlist item. Each user can wishlist a product once."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    addedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} -> {self.product.name}"
