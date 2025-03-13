from api.models import Post
from django.contrib.auth.models import User

author = User.objects.get(username='mama')

def generatePosts(numPosts = 6) :
    for i in range(numPosts):
        title = "Post " + str(i)
        content = "Content for post here" 
        post = Post.objects.create(
        title=title,
        content=content,
        author=author
    )
generatePosts(numPosts=5)
