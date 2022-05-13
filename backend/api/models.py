from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
  user_profile = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
  followings = models.ManyToManyField(User, related_name='profiles_followings', blank=True)
  created_on = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return self.user_profile.username
  
