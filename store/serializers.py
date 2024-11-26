from rest_framework import serializers
from store.models import Product, Review, Order, OrderItem, ShippingAddress, Category
from accounts.models import User
from django.conf import settings



class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        exclude = ['main_image', 'image_1', 'image_2', 'image_3']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        images = []
        base_url = settings.MEDIA_URL  # Use Django's settings to get the base URL for media files
        if instance.main_image:
            images.append(base_url + instance.main_image.name)  # Use the correct attribute 'name'
        if instance.image_1:
            images.append(base_url + instance.image_1.name)
        if instance.image_2:
            images.append(base_url + instance.image_2.name)
        if instance.image_3:
            images.append(base_url + instance.image_3.name)
        representation['images'] = images
        return representation

    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin']
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name
    def get_isAdmin(self, obj):
        return obj.is_staff

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = settings.MEDIA_URL + instance.image.file.name
        return representation
    
class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data