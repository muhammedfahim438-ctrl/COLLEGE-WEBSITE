from django.db import models


class Carousel(models.Model):
    title = models.CharField(max_length=150, blank=True, null=True)
    image = models.ImageField(upload_to='carousel/')

    def __str__(self):
        return self.title or f"Carousel {self.id}"