from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from students.models import Student
from carousel.models import Carousel
from gallery.models import Gallery
from website.models import Contact

from django.shortcuts import get_object_or_404
from carousel.models import Carousel
from gallery.models import Gallery


def admin_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'accounts/login.html')


@login_required(login_url='admin_login')
def dashboard(request):
    context = {
        'student_count': Student.objects.count(),
        'carousel_count': Carousel.objects.count(),
        'gallery_count': Gallery.objects.count(),
        'contact_count': Contact.objects.count(),
    }
    return render(request, 'accounts/dashboard.html', context)


def admin_logout(request):
    logout(request)
    return redirect('admin_login')

@login_required(login_url='admin_login')
def carousel_list(request):
    items = Carousel.objects.all().order_by('-id')
    return render(request, 'accounts/carousel_list.html', {
        'items': items
    })


@login_required(login_url='admin_login')
def carousel_add(request):
    if request.method == 'POST':
        Carousel.objects.create(
            title=request.POST.get('title'),
            image=request.FILES.get('image')
        )
        return redirect('carousel_list')

    return render(request, 'accounts/carousel_form.html')


@login_required(login_url='admin_login')
def carousel_delete(request, pk):
    item = get_object_or_404(Carousel, pk=pk)
    item.delete()
    return redirect('carousel_list')


@login_required(login_url='admin_login')
def gallery_list(request):
    items = Gallery.objects.all().order_by('-id')
    return render(request, 'accounts/gallery_list.html', {
        'items': items
    })


@login_required(login_url='admin_login')
def gallery_add(request):
    if request.method == 'POST':
        Gallery.objects.create(
            title=request.POST.get('title'),
            image=request.FILES.get('image')
        )
        return redirect('gallery_list')

    return render(request, 'accounts/gallery_form.html')


@login_required(login_url='admin_login')
def gallery_delete(request, pk):
    item = get_object_or_404(Gallery, pk=pk)
    item.delete()
    return redirect('gallery_list')
@login_required(login_url='admin_login')
def contact_list(request):
    contacts = Contact.objects.all().order_by('-id')
    return render(request, 'accounts/contact_list.html', {
        'contacts': contacts
    })


@login_required(login_url='admin_login')
def contact_delete(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    contact.delete()
    return redirect('contact_list')