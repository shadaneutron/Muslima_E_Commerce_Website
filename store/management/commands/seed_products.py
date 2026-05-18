"""
Django management command to seed the Supabase database
with sample products across 3 categories.

Usage:
    python manage.py seed_products
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Category, Product


CATEGORIES = [
    {'name': 'عباءات'},
    {'name': 'حجاب'},
    {'name': 'إكسسوارات'},
]

PRODUCTS = [
    # Abayas
    {
        'name': 'عباءة كلاسيكية سوداء',
        'description': 'عباءة أنيقة بقصة مستقيمة مصنوعة من قماش الجورجيت الفاخر، مثالية للإطلالات اليومية والمناسبات.',
        'price': 349.00,
        'countInStock': 25,
        'brand': 'مسلمة',
        'category': 'عباءات',
        'image': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    },
    {
        'name': 'عباءة مطرزة بالذهبي',
        'description': 'عباءة فاخرة مع تطريز ذهبي يدوي على الأكمام والحواف، تضفي لمسة من الأناقة والتميز.',
        'price': 599.00,
        'countInStock': 12,
        'brand': 'مسلمة',
        'category': 'عباءات',
        'image': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    },
    {
        'name': 'عباءة كيمونو عصرية',
        'description': 'عباءة بتصميم الكيمونو العصري باللون الكحلي، مريحة وأنيقة تناسب مختلف المناسبات.',
        'price': 449.00,
        'countInStock': 18,
        'brand': 'مسلمة',
        'category': 'عباءات',
        'image': 'https://images.unsplash.com/photo-1617551307578-7cf81f3eb483?w=600&q=80',
    },
    {
        'name': 'عباءة فراشة فاخرة',
        'description': 'عباءة بتصميم الفراشة المميز من قماش الشيفون الفاخر، تمنحك مظهراً راقياً وخفيفاً.',
        'price': 520.00,
        'countInStock': 8,
        'brand': 'مسلمة',
        'category': 'عباءات',
        'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    },
    # Hijabs
    {
        'name': 'حجاب جيرسي بريميوم',
        'description': 'حجاب جيرسي ناعم عالي الجودة، مريح طوال اليوم ومتوفر بألوان متعددة تناسب جميع الأذواق.',
        'price': 89.00,
        'countInStock': 50,
        'brand': 'مسلمة',
        'category': 'حجاب',
        'image': 'https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?w=600&q=80',
    },
    {
        'name': 'حجاب شيفون أنيق',
        'description': 'حجاب شيفون خفيف وأنيق، مثالي للمناسبات والسهرات، يمنحك مظهراً راقياً وجذاباً.',
        'price': 120.00,
        'countInStock': 35,
        'brand': 'مسلمة',
        'category': 'حجاب',
        'image': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&q=80',
    },
    {
        'name': 'طرحة كريب مطوية',
        'description': 'طرحة كريب بتصميم مطوي أنيق، سهلة التثبيت وتدوم طويلاً دون انزلاق.',
        'price': 99.00,
        'countInStock': 40,
        'brand': 'مسلمة',
        'category': 'حجاب',
        'image': 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?w=600&q=80',
    },
    {
        'name': 'حجاب ساتان لامع',
        'description': 'حجاب من قماش الساتان اللامع الفاخر، يضيف لمسة من البريق والأناقة لإطلالتك.',
        'price': 145.00,
        'countInStock': 4,
        'brand': 'مسلمة',
        'category': 'حجاب',
        'image': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    },
    # Accessories
    {
        'name': 'دبوس حجاب كريستال',
        'description': 'دبوس حجاب مرصع بالكريستال اللامع، يضيف لمسة بريق أنيقة لإطلالتك اليومية.',
        'price': 45.00,
        'countInStock': 60,
        'brand': 'مسلمة',
        'category': 'إكسسوارات',
        'image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    },
    {
        'name': 'طقم دبابيس ذهبية 6 قطع',
        'description': 'طقم من 6 دبابيس ذهبية اللون بأشكال متنوعة، مثالية لتثبيت الحجاب بشكل أنيق.',
        'price': 75.00,
        'countInStock': 30,
        'brand': 'مسلمة',
        'category': 'إكسسوارات',
        'image': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    },
    {
        'name': 'قبعة داخلية قطنية',
        'description': 'قبعة داخلية من القطن الناعم لثبات الحجاب وراحة أكبر، تغطي الرأس بالكامل.',
        'price': 35.00,
        'countInStock': 2,
        'brand': 'مسلمة',
        'category': 'إكسسوارات',
        'image': 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
    },
    {
        'name': 'حقيبة يد جلدية صغيرة',
        'description': 'حقيبة يد أنيقة من الجلد الصناعي عالي الجودة، تتسع للأساسيات وتناسب مختلف المناسبات.',
        'price': 280.00,
        'countInStock': 15,
        'brand': 'مسلمة',
        'category': 'إكسسوارات',
        'image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with sample Islamic fashion products'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('\n[*] Seeding Muslima Store database...\n'))

        # Get or create an admin user to assign products to
        admin_user, created_admin = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@muslima.store',
                'first_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created_admin:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('  [+] Created admin user (admin / admin123)'))
        else:
            self.stdout.write('  [i] Admin user already exists')

        # Create categories
        category_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(name=cat_data['name'])
            category_map[cat_data['name']] = cat
            status = '[+] Created' if created else '[i] Exists'
            self.stdout.write(f'  {status}: Category -> {cat.name}')

        # Create products
        created_count = 0
        skipped_count = 0
        for p_data in PRODUCTS:
            if Product.objects.filter(name=p_data['name']).exists():
                self.stdout.write(f"  [i] Skipping (exists): {p_data['name']}")
                skipped_count += 1
                continue

            category = category_map.get(p_data['category'])
            product = Product.objects.create(
                user=admin_user,
                name=p_data['name'],
                description=p_data['description'],
                price=p_data['price'],
                countInStock=p_data['countInStock'],
                brand=p_data['brand'],
                category=category,
            )
            # Store URL directly in image field name (string-based image URL)
            Product.objects.filter(_id=product._id).update(image=p_data['image'])

            self.stdout.write(self.style.SUCCESS(f"  [+] Created: {product.name} ({p_data['category']}) - {p_data['price']} EGP"))
            created_count += 1

        self.stdout.write(self.style.MIGRATE_HEADING(
            f'\n[DONE] Seeding complete! Created {created_count} products, skipped {skipped_count}.\n'
        ))
