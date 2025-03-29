"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import CreatePostView
from django.urls import path,include
from .views import PostListView,PostDetailView, PostDeleteView, PostUpdateView, SearchPostsView
from .views import retrievePrompt, sentimentAnalysis, PasswordResetRequestView
from .views import verify_reset_authenticity, set_new_password

from django.contrib.auth import views as auth_views

urlpatterns = [
    path("create/",CreatePostView.as_view(), name='create_post'),
    path('posts/',PostListView.as_view(), name="note_list"),
    path('delete/<int:pk>/',PostDeleteView.as_view(), name='delete_post' ),
    path('posts/<int:pk>/',PostDetailView.as_view(), name='individual_post' ),
    path('edit/<int:pk>/', PostUpdateView.as_view(), name='edit-post' ),
    path('search/', SearchPostsView.as_view(),name='search'),
    path('retrieve-prompt/',retrievePrompt, name='retrieve_prompt'),
    path('post-sentiment/', sentimentAnalysis, name='sentiment-analysis'),

    path('email_reset_password/', PasswordResetRequestView.as_view(), name='password_reset_link'),
    path('reset/<uidb64>/<token>/',verify_reset_authenticity, name='password_reset_confirm'),
    path('set_new_password/', set_new_password, name='set_new_password')
    #path('reset/set_new_password', )
   # path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
   # path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),


]
