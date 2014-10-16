from django.db import models
from datetime import datetime

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
    dateTime = models.DateTimeField(default=datetime.now, blank=True)

    #Separate lat and lon fields
    lat = models.DecimalField(max_digits=30, decimal_places=20)
    lon = models.DecimalField(max_digits=30, decimal_places=20)
    hazard_type = models.CharField(max_length=25, choices=HAZARD_CHOICE)
    description = models.TextField(max_length=150, null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_CHOICE)

    def __repr__(self):
        out = "Hazard @ <" + str(self.lat) + ", " + str(self.lon) + "> called \"" + self.description + "\""
        return out
