from django.shortcuts import render

# Create your views here.
from app.forms import HazardForm
#from django.http import HttpResponseRedirect
from app.models import Hazard


def index(request):
    if request.method == 'POST':
        form = HazardForm(request.POST)
        if form.is_valid():
            form.save()
            #return HttpResponseRedirect('/')

    # elif request.method == 'GET':
    #     data = Hazard.objects.all()
    #     return render(request, 'index.html', {
    #     'data': data,
    # })
    else:
        form = HazardForm() # An unbound form

    return render(request, 'index.html', {
        'form': form,
    })


# Need collect data and send it to view
def map(request):
    return render(request, "map.html")
