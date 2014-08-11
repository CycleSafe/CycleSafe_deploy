from bootstrap3_datetime.widgets import DateTimePicker
from django import forms
from app.models import Hazard
from django.forms import ModelForm

#Need too add value attribute to form item.
class HazardForm(ModelForm):
    class Meta:
        model = Hazard


