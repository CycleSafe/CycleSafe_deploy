
from django import forms
from app.models import Hazard
from django.forms import ModelForm, TextInput

#Need too add value attribute to form item.
class HazardForm(ModelForm):
    class Meta:
        model = Hazard

        # def __init__(self, *args, **kwargs):
        #   super(HazardForm, self).__init__(*args, **kwargs)
        #   self.fields = TextInput(attrs={
        #       'type': 'text'})
