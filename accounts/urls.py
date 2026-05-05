from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.admin_login, name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),
    path('dashboard/', views.dashboard, name='dashboard'),

    path('carousel/', views.carousel_list, name='carousel_list'),
    path('carousel/add/', views.carousel_add, name='carousel_add'),
    path('carousel/delete/<int:pk>/', views.carousel_delete, name='carousel_delete'),

    path('gallery/', views.gallery_list, name='gallery_list'),
    path('gallery/add/', views.gallery_add, name='gallery_add'),
    path('gallery/delete/<int:pk>/', views.gallery_delete, name='gallery_delete'),
    path('contacts/', views.contact_list, name='contact_list'),
path('contacts/delete/<int:pk>/', views.contact_delete, name='contact_delete'),
]