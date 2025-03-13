from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post

#Converts a Model into JSON format for API outgoing requests
#Also converts incoming API requests of data into Models 

class UserSerializer(serializers.ModelSerializer) :
    class Meta: 
        model = User 
        fields = ['id', 'username', 'password']
        extra_kwargs = {"password": {"write_only": True}} #Ensures only shown when creating user

       
    #Creates a new user from the validated_data passed into it
    def create(self, validated_data) :
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class PostSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Post
        fields = ['id','title','content','created_at']

    def create(self,validated_data) :
        return Post.objects.create(**validated_data)




