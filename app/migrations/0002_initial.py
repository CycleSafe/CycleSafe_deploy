# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Hazard'
        db.create_table(u'app_hazard', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('dateTime', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('hazard_type', self.gf('django.db.models.fields.CharField')(max_length=25)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=150, null=True, blank=True)),
            ('user_type', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal(u'app', ['Hazard'])


    def backwards(self, orm):
        # Deleting model 'Hazard'
        db.delete_table(u'app_hazard')


    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'dateTime': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']