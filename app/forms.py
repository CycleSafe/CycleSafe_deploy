
from app.models import Hazard
from django.forms import ModelForm, DateTimeInput

#Need to add value attribute to form item and get datepicker to work.
class HazardForm(ModelForm):
    class Meta:
        model = Hazard

        # def __init__(self, *args, **kwargs):
        #   super(HazardForm, self).__init__(*args, **kwargs)
        #   self.fields = TextInput(attrs={
        #       'type': 'text'})
        widgets = {'dateTime': DateTimeInput(attrs={'class': 'datepicker'})}
