from django import forms
from django.forms import ModelForm
from app.models import Hazard



class HazardForm(ModelForm):
    class Meta:
        model = Hazard

