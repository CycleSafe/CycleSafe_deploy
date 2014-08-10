# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Hazard.dateTime'
        db.delete_column(u'app_hazard', 'dateTime')

        # Adding field 'Hazard.datetime_id'
        db.add_column(u'app_hazard', 'datetime_id',
                      self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Hazard.dateTime'
        db.add_column(u'app_hazard', 'dateTime',
                      self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Hazard.datetime_id'
        db.delete_column(u'app_hazard', 'datetime_id')


    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'datetime_id': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']