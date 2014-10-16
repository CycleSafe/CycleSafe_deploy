# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Hazard.lon'
        db.alter_column(u'app_hazard', 'lon', self.gf('django.db.models.fields.DecimalField')(max_digits=30, decimal_places=20))

        # Changing field 'Hazard.lat'
        db.alter_column(u'app_hazard', 'lat', self.gf('django.db.models.fields.DecimalField')(max_digits=30, decimal_places=20))

    def backwards(self, orm):

        # Changing field 'Hazard.lon'
        db.alter_column(u'app_hazard', 'lon', self.gf('django.db.models.fields.DecimalField')(max_digits=15, decimal_places=10))

        # Changing field 'Hazard.lat'
        db.alter_column(u'app_hazard', 'lat', self.gf('django.db.models.fields.DecimalField')(max_digits=15, decimal_places=10))

    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'dateTime': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.DecimalField', [], {'max_digits': '30', 'decimal_places': '20'}),
            'lon': ('django.db.models.fields.DecimalField', [], {'max_digits': '30', 'decimal_places': '20'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']