from django.shortcuts import get_object_or_404, render, redirect
from .forms import AllBooksForm
from .models import AllBooks, Users
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password


# Create your views here.

from django.http import JsonResponse

def homepage(request):
    user = None
    user_id = request.session.get('user_id')

    if user_id:
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            user = None

    return render(request, 'library/homepage.html', {'user': user})

def signup(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        role = request.POST.get('role')

        if Users.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'library/sign-up.html')

        if Users.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'library/sign-up.html')

        hashed_password = make_password(password)
        user = Users(username=username, email=email, password=hashed_password, role=role)
        user.save()

        
        request.session['user_id'] = user.id

        return redirect('homepage')

    return render(request, 'library/sign-up.html')

def signin(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = Users.objects.get(email=email)
            if check_password(password, user.password):
                request.session['user_id'] = user.id
                return redirect('homepage')
            else:
                return render(request, 'library/sign-in.html', {'error': 'Incorrect password'})
        except Users.DoesNotExist:
            return render(request, 'library/sign-in.html', {'error': 'User not found'})

    return render(request, 'library/sign-in.html')

def books(request):
    user = None
    user_id = request.session.get('user_id')

    if user_id:
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            user = None

    return render(request, 'library/Books.html', {'user': user})

def my_books(request):

    return render(request, 'library/Books.html')

def api_books(request):
    books = AllBooks.objects.all()
    data = [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "category": book.category,
            "description": book.description,
            "cover": book.cover.url if book.cover else "",
            'available': book.book_status == 'available',
        }
        for book in books
    ]
    return JsonResponse(data, safe=False)

def add_book(request):
    user = None
    user_id = request.session.get('user_id')

    if user_id:
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            user = None

    if request.method == 'POST':
        form = AllBooksForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save()
            return redirect('edit', book_id=book.id) 
    else:
        form = AllBooksForm() 

    return render(request, 'library/add-book.html', {'form': form})

@csrf_protect
def preview_edit(request, book_id):
    book = get_object_or_404(AllBooks, id=book_id)

    is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'

    if request.method == 'POST' and is_ajax:
        form = AllBooksForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

    form = AllBooksForm(instance=book)
    return render(request, 'library/previewEdit.html', {'form': form, 'book': book})

def preview(request, id):
    book = get_object_or_404(AllBooks, id=id)
    return render(request, 'library/preview.html', {'book': book})

def delete_book(request, book_id):
    book = get_object_or_404(AllBooks, id=book_id)
    if request.method == 'POST':
        book.delete()
        return redirect('books') 
    return render(request, 'library/confirm_delete.html', {'book': book})

def about_us(request):
    

    return render(request, 'library/about-us.html')


def user_profile(request):

    return render(request, 'library/user-profile.html')

def log_out(request):
    request.session.flush()
    return redirect('sign-in') 