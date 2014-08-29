# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Hazard.geoposition'
        db.delete_column(u'app_hazard', 'geoposition')

        # Adding field 'Hazard.lat'
        db.add_column(u'app_hazard', 'lat',
                      self.gf('django.db.models.fields.DecimalField')(default=1, max_digits=15, decimal_places=10),
                      keep_default=False)

        # Adding field 'Hazard.lon'
        db.add_column(u'app_hazard', 'lon',
                      self.gf('django.db.models.fields.DecimalField')(default=1, max_digits=15, decimal_places=10),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Hazard.geoposition'
        db.add_column(u'app_hazard', 'geoposition',
                      self.gf('geoposition.fields.GeopositionField')(default=1, max_length=42),
                      keep_default=False)

        # Deleting field 'Hazard.lat'
        db.delete_column(u'app_hazard', 'lat')

        # Deleting field 'Hazard.lon'
        db.delete_column(u'app_hazard', 'lon')


    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'dateTime': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.DecimalField', [], {'max_digits': '15', 'decimal_places': '10'}),
            'lon': ('django.db.models.fields.DecimalField', [], {'max_digits': '15', 'decimal_places': '10'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']