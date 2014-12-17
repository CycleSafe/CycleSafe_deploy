from app.models import Hazard
from django.forms import ModelForm, DateTimeInput
from django.forms.widgets import RadioSelect


class HazardForm(ModelForm):
    class Meta:
        model = Hazard
        widgets = {'date_time': DateTimeInput(attrs={'class': 'datepicker'}),
                   'user_type': RadioSelect(attrs={'id': 'value', 'class': 'hidden inline-block'})}
        # TODO(zemadi): Assign someone to edit ranking field once it's implemented.
        exclude = ('ranking',)
