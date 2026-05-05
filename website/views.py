from django.shortcuts import render, redirect
from django.contrib import messages
from carousel.models import Carousel
from gallery.models import Gallery
from .models import Contact


def home(request):
    if request.method == 'POST':
        Contact.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            subject=request.POST.get('subject'),
            message=request.POST.get('message'),
        )

        messages.success(request, 'Thank you! Your message has been sent successfully.')
        return redirect('/#contact')

    carousels = Carousel.objects.all()
    images = Gallery.objects.all()

    return render(request, 'website/home.html', {
        'carousels': carousels,
        'images': images,
    })