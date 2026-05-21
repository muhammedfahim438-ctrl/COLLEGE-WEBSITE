from django.urls import path
from . import views

urlpatterns = [
    path('create-order/',    views.create_order,     name='create_order'),
    path('verify-payment/',  views.verify_payment,   name='verify_payment'),
    path('list/',            views.admission_list,   name='admission_list'),
    path('delete/<int:pk>/', views.admission_delete, name='admission_delete'),
    path('receipt/<int:pk>/',views.download_receipt, name='download_receipt'),  # ← NEW
]