
from app.models import Hazard
from django.forms import ModelForm, DateTimeInput

#Need to add value attribute to form item and get datepicker to work.
class HazardForm(ModelForm):
    class Meta:
        model = Hazard
        widgets = {'dateTime': DateTimeInput(attrs={'class': 'datepicker'})}
