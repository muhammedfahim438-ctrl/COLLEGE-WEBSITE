from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    course = models.CharField(max_length=100)
    date_of_joining = models.DateField()

    def __str__(self):
        return self.name