from django.db import models

# Create your models here.

class RoomMembers(models.Model):
    username = models.CharField(max_length=100)
    user_uid = models.CharField(max_length=100)
    room_name = models.CharField(max_length=100)

    def __str__(self):
        return self.username