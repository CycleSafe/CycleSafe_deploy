from django.db import models

# Need to figure out how to add a tooltip here. Maybe putting this data into the model is  better.
from south.utils.datetime_utils import datetime

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
    date_time = models.DateTimeField(default=datetime.now, blank=True)
    description = models.TextField(max_length=150, null=True, blank=True)
    hazard_type = models.CharField(max_length=25, choices=HAZARD_CHOICE, default='3')
    lat = models.DecimalField(max_digits=30, decimal_places=20)
    lon = models.DecimalField(max_digits=30, decimal_places=20)
    ranking = models.IntegerField(default=0)
    user_type = models.CharField(max_length=20, choices=USER_CHOICE, default='1')

    def __repr__(self):
        out = "Hazard @ <" + str(self.lat) + ", " + str(self.lon) + "> called \"" + self.description + "\""
        return out
