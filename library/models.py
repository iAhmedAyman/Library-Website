from django.db import models

# USER TABLE
class Users(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=30, blank=True , null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username

# ALLBOOKS TABLE
from django.db import models

class AllBooks(models.Model):
    BOOK_STATUS = [
        ('available', 'Available'),
        ('borrowed', 'Borrowed'),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    description = models.TextField()
    book_status = models.CharField(max_length=10, choices=BOOK_STATUS, default='available')
    cover = models.ImageField(
        null=True,
        blank=True,
        default='default/Cover.png'
        )

    def __str__(self):
        return self.title


# BORROWEDBOOKS TABLE (many-to-many relationship)
class BorrowedBook(models.Model):
    book = models.ForeignKey(AllBooks, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"

# FAVOURITEBOOKS TABLE (many-to-many relationship)
class FavouriteBook(models.Model):
    book = models.ForeignKey(AllBooks, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorited {self.book.title}"
