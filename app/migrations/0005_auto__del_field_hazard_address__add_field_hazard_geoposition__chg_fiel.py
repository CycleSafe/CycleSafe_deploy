# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Hazard.address'
        db.delete_column(u'app_hazard', 'address')

        # Adding field 'Hazard.geoposition'
        db.add_column(u'app_hazard', 'geoposition',
                      self.gf('geoposition.fields.GeopositionField')(default=1, max_length=42),
                      keep_default=False)


        # Changing field 'Hazard.dateTime'
        db.alter_column(u'app_hazard', 'dateTime', self.gf('django.db.models.fields.DateTimeField')())

    def backwards(self, orm):

        # User chose to not deal with backwards NULL issues for 'Hazard.address'
        raise RuntimeError("Cannot reverse this migration. 'Hazard.address' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration        # Adding field 'Hazard.address'
        db.add_column(u'app_hazard', 'address',
                      self.gf('django.db.models.fields.CharField')(max_length=100),
                      keep_default=False)

        # Deleting field 'Hazard.geoposition'
        db.delete_column(u'app_hazard', 'geoposition')


        # Changing field 'Hazard.dateTime'
        db.alter_column(u'app_hazard', 'dateTime', self.gf('django.db.models.fields.DateTimeField')(null=True))

    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'dateTime': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'geoposition': ('geoposition.fields.GeopositionField', [], {'max_length': '42'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']