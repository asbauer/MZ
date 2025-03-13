from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, filters
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import PostSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied



from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django.core.paginator import Paginator
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend



# Create your views here.
class CreatePostView(generics.CreateAPIView) :
    #List of all objects looking at when creating a new one
    #so that we don't accidentally create one that already exists
    querySet = Post.objects.all()
    serializer_class = PostSerializer #Tells view which kind of data we need to accept to make a new post
    permission_classes = [IsAuthenticated] #Who can call this view


    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            author = User.objects.get(username='mama')
            serializer.save(author=author)
        else:
            print(serializer.errors)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class PostPagination(PageNumberPagination) :
    page_size = 5 
    page_size_query_param = 'page_size'


class PostDetailView(generics.RetrieveAPIView) :
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]


class PostUpdateView(RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        print("Here!")
        post = self.get_object()
        if self.request.user != post.author:
            print("Ruh Roh!")
            raise PermissionDenied("You are not allowed to edit this post.")
        serializer.save()


class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    pagination_class = PostPagination

    def get_queryset(self):
        #user = self.request.user
        #return Post.objects.filter(author=user)
        return Post.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class SearchPostsView(generics.ListAPIView) :
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    pagination_class = PostPagination
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    search_fields = ['title','content']
    

    


#class PostDeleteView(generics.DestroyAPIView) :
#    queryset = Post.objects.all()
#    serializer_class = PostSerializer
#    permission_classes = [AllowAny]

class PostDeleteView(generics.DestroyAPIView) :
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

'''
class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        # Get the post to be deleted
        post = self.get_object()
        
        # Save the current page number
        current_page = self.request.GET.get('page', 1)
        
        # Get the number of posts per page (this should match your pagination class)
        page_size = 5  # This matches your `PostPagination` class page size

        # Delete the post
        post.delete()

        # Get the remaining posts after deletion
        posts = Post.objects.all()
        paginator = Paginator(posts, page_size)
        page_obj = paginator.get_page(current_page)

        # If the page has no posts left, go to the first page
        if not page_obj.has_next() and current_page != '1':
           # current_page = 1
           current_page -= 1
        
        # Prepare the response with paginated posts
        serializer = PostSerializer(page_obj, many=True)
        response_data = {
            'posts': serializer.data,
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': current_page,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def get_object(self):
        try:
            return Post.objects.get(pk=self.kwargs['pk'])
        except Post.DoesNotExist:
            raise Http404


'''