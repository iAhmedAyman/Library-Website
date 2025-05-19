# forms.py
from django import forms
from .models import AllBooks

class AllBooksForm(forms.ModelForm):
    class Meta:
        model = AllBooks
        fields = ['title', 'author', 'category', 'description', 'cover']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Book title'}),
            'author': forms.TextInput(attrs={'placeholder': 'Author name'}),
            'category': forms.TextInput(attrs={'placeholder': 'Category'}),
            'description': forms.Textarea(attrs={'placeholder': 'Book description'}),
            'cover': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
        }


