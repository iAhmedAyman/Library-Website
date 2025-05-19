from django.contrib import admin
from .models import Users, AllBooks, BorrowedBook, FavouriteBook

admin.site.register(Users)
admin.site.register(AllBooks)
admin.site.register(BorrowedBook)
admin.site.register(FavouriteBook)