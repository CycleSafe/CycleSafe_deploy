from django.shortcuts import render
from app.forms import HazardForm
# from django.http import HttpResponseRedirect
from app.models import Hazard


def index(request):
    projects = Hazard.objects.all()
    for project in projects:
        print(project)
    print(projects)
    data = {'projects': projects}
    return render(request, "index.html", data)


# Will need to update report hazards when user hits submit, without reloading page.
def report_hazards(request):
    if request.method == 'POST':
        form = HazardForm(request.POST)
        if form.is_valid():
            form.save()
    else:
        form = HazardForm()  # An unbound form

    return render(request, 'report.html', {
        'form': form,
        'hazards': Hazard.objects.all(),
    })

'''
JavaScript will make a direct request for the data via the API, instead of running it here.
We may need to optimize this later to avoid slow load times. Google maps can be very client-side heavy.
'''
def map(request):
    return render(request, 'map.html')

def print_hazards(request):
	return HttpResponse("woot")

################################################################################
# utility functions
################################################################################

# todo: add as needed