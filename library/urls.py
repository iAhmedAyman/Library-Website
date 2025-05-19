from django.urls import path
from . import views

urlpatterns = [
    path('', views.signin, name='login'),
    path('homepage/', views.homepage, name='homepage'),

    path('sign-up/', views.signup, name='signup'),
    path('sign-in/', views.signin, name='sign-in'),

    path('books/', views.books, name='books'),
    path('api/books/', views.api_books, name='api-books'),
    path('add_book/', views.add_book, name='add_book'),

    path('my-books/', views.my_books, name='my_books'),

    
    path('add_book/preview/<int:book_id>/', views.preview_edit, name='edit'),
    path('books/preview/<int:book_id>/', views.preview, name='preview_book'),


    path('delete_book/<int:book_id>/', views.delete_book, name='delete_book'),

    path('about/', views.about_us, name='about'),

    path('user-profile/', views.user_profile, name='user_profile'),

    path('log-out/', views.log_out, name='logout'),
]
