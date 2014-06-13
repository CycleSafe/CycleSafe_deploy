# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Hazard.time'
        db.delete_column(u'app_hazard', 'time')


        # Changing field 'Hazard.date'
        db.alter_column(u'app_hazard', 'date', self.gf('django.db.models.fields.DateTimeField')(null=True))

    def backwards(self, orm):
        # Adding field 'Hazard.time'
        db.add_column(u'app_hazard', 'time',
                      self.gf('django.db.models.fields.TimeField')(null=True, blank=True),
                      keep_default=False)


        # Changing field 'Hazard.date'
        db.alter_column(u'app_hazard', 'date', self.gf('django.db.models.fields.DateField')(null=True))

    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '300', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['app']