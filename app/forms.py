from bootstrap3_datetime.widgets import DateTimePicker
from django import forms
from app.models import Hazard
from django.forms import ModelForm


class HazardForm(ModelForm):
    class Meta:
        model = Hazard
        def __init__(self, *args, **kwargs):
          super(HazardForm, self).__init__(*args, **kwargs)
          self.fields = TextInput(attrs={
              'class': 'form-control'})