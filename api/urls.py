from django.urls import path
from .views import (
    StudentListCreateAPI,
    StudentDetailAPI,
    CarouselListAPI,
    GalleryListAPI,
    ContactListAPI,
    LoginAPI,
    SendOTPAPI,
    VerifyOTPAPI,
)

urlpatterns = [
    path('login/', LoginAPI.as_view()),
    path('send-otp/', SendOTPAPI.as_view()),
    path('verify-otp/', VerifyOTPAPI.as_view()),

    path('students/', StudentListCreateAPI.as_view()),
    path('students/<int:pk>/', StudentDetailAPI.as_view()),

    path('carousel/', CarouselListAPI.as_view()),
    path('gallery/', GalleryListAPI.as_view()),
    path('contacts/', ContactListAPI.as_view()),
]