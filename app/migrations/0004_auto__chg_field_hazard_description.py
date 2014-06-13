# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Hazard.description'
        db.alter_column(u'app_hazard', 'description', self.gf('django.db.models.fields.TextField')(max_length=200, null=True))

    def backwards(self, orm):

        # Changing field 'Hazard.description'
        db.alter_column(u'app_hazard', 'description', self.gf('django.db.models.fields.TextField')(max_length=300, null=True))

    models = {
        u'app.hazard': {
            'Meta': {'object_name': 'Hazard'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'dateTime': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'hazard_type': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user_type': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']