from django.shortcuts import render

# Create your views here.
from app.forms import HazardForm
#from django.http import HttpResponseRedirect
from app.models import Hazard

from django.shortcuts import redirect

def index(request):
	return redirect('/report_hazard/')

def view_hazards(request):
	return index(request)

def report_hazard(request):
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
	# pull data here, send it to map view
	# get request under map view
	hazards = Hazard.objects.all()
	data = {"hazards" : hazards}
	print("hazards:")
	for hazard in hazards:
		print("hazard found!")
	print("----------")
	return render(request, "map.html", data)
