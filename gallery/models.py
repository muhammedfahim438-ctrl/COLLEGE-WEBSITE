from django.db import models


class Gallery(models.Model):
    title = models.CharField(max_length=150, blank=True, null=True)
    image = models.ImageField(upload_to='gallery/')

    def __str__(self):
        return self.title or f"Gallery {self.id}"