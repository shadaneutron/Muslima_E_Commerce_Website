"""
Management command: seed_boutique
Seeds the Supabase database with 15 premium Khaleeji boutique products.
Usage: python manage.py seed_boutique
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Category, Product


CATEGORIES = [
    {'name': 'عباءات خليجي', 'name_en': 'Khaleeji Abayas'},
    {'name': 'حجاب عصري',   'name_en': 'Modern Hijabs'},
    {'name': 'جيبات راقية', 'name_en': 'Elegant Skirts'},
]

PRODUCTS = [
    # ── عباءات خليجي (7 products) ─────────────────────────────────────
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة خليجية بالكريستال',
        'brand': 'Khaleeji Crystal Abaya',
        'description': 'عباءة خليجية فاخرة مزينة بالكريستالات اللامعة على الأكمام والياقة. قماش جورجيت ناعم يمنحك أناقة لا مثيل لها في كل المناسبات.',
        'price': 750.00,
        'countInStock': 14,
        'image': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة أميرة الخليج',
        'brand': 'Gulf Princess Abaya',
        'description': 'عباءة مفتوحة أمامية بتطريز ذهبي يدوي فاخر على طول الجانبين. تصميم يجمع بين التراث الخليجي الأصيل والرقي المعاصر.',
        'price': 920.00,
        'countInStock': 8,
        'image': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة الشيفون الملكية',
        'brand': 'Royal Chiffon Abaya',
        'description': 'عباءة من قماش الشيفون الفاخر المزدوج بألوان باردة راقية. خفيفة الوزن ومريحة للاستخدام اليومي والمناسبات الرسمية على حد سواء.',
        'price': 580.00,
        'countInStock': 22,
        'image': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة الزهور المطرزة',
        'brand': 'Floral Embroidered Abaya',
        'description': 'عباءة فريدة مزينة بتطريز الزهور العربية التقليدية على القماش الأسود المخملي. تحفة فنية ترتدينها.',
        'price': 1100.00,
        'countInStock': 5,
        'image': 'https://images.unsplash.com/photo-1617551307578-7cf81f3eb483?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة الدانتيل الفاخرة',
        'brand': 'Luxury Lace Abaya',
        'description': 'عباءة بأكمام دانتيل رقيقة وحافات مطرزة. تجمع بين الأنوثة والحشمة بأسلوب عصري جذاب ومميز.',
        'price': 680.00,
        'countInStock': 18,
        'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة الكيمونو العربية',
        'brand': 'Arabian Kimono Abaya',
        'description': 'إلهام من التصاميم الشرقية مع لمسة عربية خالصة. عباءة واسعة بقصة كيمونو مع حزام داخلي يبرز القوام بشكل رائع.',
        'price': 495.00,
        'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?w=800&q=85',
    },
    {
        'category': 'عباءات خليجي',
        'name': 'عباءة العقيق الفاخرة',
        'brand': 'Aqeeq Luxury Abaya',
        'description': 'عباءة بلون عنابي داكن فاخر مزينة بأحجار العقيق الطبيعي على الياقة. تصميم حصري يليق بالسيدة الأنيقة.',
        'price': 850.00,
        'countInStock': 3,
        'image': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85',
    },

    # ── حجاب عصري (5 products) ─────────────────────────────────────────
    {
        'category': 'حجاب عصري',
        'name': 'حجاب الحرير الطبيعي',
        'brand': 'Natural Silk Hijab',
        'description': 'حجاب من الحرير الطبيعي 100% بأجمل الألوان الباردة. ناعم كالريش على البشرة، يمنحك مظهراً راقياً في كل المناسبات.',
        'price': 285.00,
        'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?w=800&q=85',
    },
    {
        'category': 'حجاب عصري',
        'name': 'طرحة الشيفون الكريمي',
        'brand': 'Cream Chiffon Wrap',
        'description': 'طرحة شيفون بلون كريمي دافئ، خفيفة وشفافة بأسلوب موضة 2025. تناسب الوجه المستدير والبيضاوي بنفس الأناقة.',
        'price': 145.00,
        'countInStock': 55,
        'image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85',
    },
    {
        'category': 'حجاب عصري',
        'name': 'إيشارب المخمل الأنيق',
        'brand': 'Velvet Elegant Scarf',
        'description': 'إيشارب من المخمل الفاخر بألوان خريفية دافئة. يمكن تنسيقه بطرق عديدة — عمامة، لفة كلاسيكية، أو دراما فاخرة.',
        'price': 220.00,
        'countInStock': 28,
        'image': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85',
    },
    {
        'category': 'حجاب عصري',
        'name': 'حجاب الكريب المطوي',
        'brand': 'Pleated Crepe Hijab',
        'description': 'حجاب كريب بطيات ثابتة تمنحه شكلاً منظماً طوال اليوم دون الحاجة لإعادة ترتيب. مثالي للعمل والمناسبات الرسمية.',
        'price': 175.00,
        'countInStock': 45,
        'image': 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=85',
    },
    {
        'category': 'حجاب عصري',
        'name': 'باندانا العصمة الفاخرة',
        'brand': 'Luxury Bandana Hijab',
        'description': 'باندانا حجاب بطبعات ورود أنيقة مستوحاة من تصاميم باريسية. أسلوب عصري يجمع الحشمة بإطلالة تراندي مميزة.',
        'price': 190.00,
        'countInStock': 2,
        'image': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=85',
    },

    # ── جيبات راقية (3 products) ────────────────────────────────────────
    {
        'category': 'جيبات راقية',
        'name': 'جيبة الكتان الفلوري',
        'brand': 'Flowy Linen Skirt',
        'description': 'جيبة ماكسي من الكتان الطبيعي بتصميم فلوري حر يتحرك بأناقة مع كل خطوة. تناسب الطقس الدافئ مع إطلالة بوهيمية حشمة.',
        'price': 380.00,
        'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85',
    },
    {
        'category': 'جيبات راقية',
        'name': 'جيبة الساتان اللامع',
        'brand': 'Satin Gloss Skirt',
        'description': 'جيبة ميدي من الساتان اللامع الفاخر بألوان زاهية راقية. تبدو رائعة في السهرات والأعراس وحفلات التخرج.',
        'price': 450.00,
        'countInStock': 12,
        'image': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85',
    },
    {
        'category': 'جيبات راقية',
        'name': 'جيبة التويد الكلاسيكية',
        'brand': 'Classic Tweed Skirt',
        'description': 'جيبة من قماش التويد بأنماط هندسية كلاسيكية. تصميم بريطاني رفيع المستوى يمنحك إطلالة لا تنسى في بيئة العمل والمناسبات.',
        'price': 520.00,
        'countInStock': 9,
        'image': 'https://images.unsplash.com/photo-1617551307578-7cf81f3eb483?w=800&q=85',
    },
]


class Command(BaseCommand):
    help = 'Seeds the Supabase DB with 15 premium Khaleeji boutique products'

    def handle(self, *args, **options):
        self.stdout.write('\n[*] Clearing old products and categories...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        self.stdout.write('[+] Old data cleared.')

        # Create/get admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@muslima.boutique',
                'first_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('[+] Admin user created (admin / admin123)')
        else:
            self.stdout.write('[i] Admin user already exists')

        # Create categories
        category_map = {}
        for cat in CATEGORIES:
            obj = Category.objects.create(name=cat['name'])
            category_map[cat['name']] = obj
            self.stdout.write(f"[+] Category: {cat['name_en']}")

        # Create products
        count = 0
        for p in PRODUCTS:
            cat = category_map[p['category']]
            product = Product.objects.create(
                user=admin_user,
                name=p['name'],
                brand=p['brand'],
                description=p['description'],
                price=p['price'],
                countInStock=p['countInStock'],
                category=cat,
            )
            Product.objects.filter(_id=product._id).update(image=p['image'])
            count += 1
            self.stdout.write(f"[+] Product {count:02d}: {p['brand']} - {p['price']} EGP")

        self.stdout.write(f'\n[DONE] {count} products seeded across {len(CATEGORIES)} categories.\n')
