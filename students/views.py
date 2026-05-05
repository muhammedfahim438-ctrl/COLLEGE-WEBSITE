from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Student


@login_required(login_url='admin_login')
def student_list(request):
    query = request.GET.get('q')

    students = Student.objects.all().order_by('-id')

    if query:
        students = students.filter(name__icontains=query)

    return render(request, 'students/student_list.html', {
        'students': students,
        'query': query
    })


@login_required(login_url='admin_login')
def student_add(request):
    if request.method == 'POST':
        Student.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            course=request.POST.get('course'),
            date_of_joining=request.POST.get('date_of_joining'),
        )
        return redirect('student_list')

    return render(request, 'students/student_form.html')


@login_required(login_url='admin_login')
def student_edit(request, pk):
    student = get_object_or_404(Student, pk=pk)

    if request.method == 'POST':
        student.name = request.POST.get('name')
        student.email = request.POST.get('email')
        student.phone = request.POST.get('phone')
        student.course = request.POST.get('course')
        student.date_of_joining = request.POST.get('date_of_joining')
        student.save()

        return redirect('student_list')

    return render(request, 'students/student_form.html', {
        'student': student
    })


@login_required(login_url='admin_login')
def student_delete(request, pk):
    student = get_object_or_404(Student, pk=pk)
    student.delete()
    return redirect('student_list')