from app.models import Hazard
from django.forms import ModelForm, DateTimeInput

class HazardForm(ModelForm):
    class Meta:
        model = Hazard
        widgets = {'date_time': DateTimeInput(attrs={'class': 'datepicker'})}
        # TODO(zemadi): Assign someone to edit ranking field once it's implemented.
        exclude = ('ranking',)
