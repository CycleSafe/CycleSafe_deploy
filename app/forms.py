from bootstrap3_datetime.widgets import DateTimePicker
from django import forms
from app.models import Hazard



class HazardForm(forms.Form):
    todo = forms.CharField(
        widget=forms.TextInput(attrs={"class": "form-control"}))
    date = forms.DateField(
        widget=DateTimePicker(options={"format": "YYYY-MM-DD",
                                       "pickTime": False}))
    reminder = forms.DateTimeField(
        required=False,
        widget=DateTimePicker(options={"format": "YYYY-MM-DD HH:mm",
                                       "pickSeconds": False}))