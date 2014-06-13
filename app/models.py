from django.db import models

#Need to add null, default values, etc.

#Need to figure out how to add a tooltip here. Maybe putting this data into the model is  better.
HAZARD_CHOICE = (
('1', 'Construction'),
('2', 'Dangerous Crossing'),
('3', 'Dangerous Road'),
('4', 'Heavy Traffic'),
('5', 'Low Visibility'),
('6', 'Obstruction'),
)

USER_CHOICE = (
('1', 'Cyclist'),
('2', 'Pedestrian'),
)

class Hazard(models.Model):
    dateTime = models.DateTimeField(null=True, blank=True)
    #time = models.TimeField(null=True, blank=True)
    address = models.CharField(max_length=100)
    hazard_type = models.CharField(max_length=25, choices=HAZARD_CHOICE)
    description = models.TextField(max_length=150, null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_CHOICE)