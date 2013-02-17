# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Car.capacity_of_car'
        db.add_column('risk_management_site_car', 'capacity_of_car',
                      self.gf('django.db.models.fields.IntegerField')(default=5),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Car.capacity_of_car'
        db.delete_column('risk_management_site_car', 'capacity_of_car')


    models = {
        'risk_management_site.car': {
            'Meta': {'object_name': 'Car'},
            'capacity_of_car': ('django.db.models.fields.IntegerField', [], {}),
            'comming_location_date': ('django.db.models.fields.DateTimeField', [], {}),
            'contact': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'picture': ('django.db.models.fields.TextField', [], {}),
            'point': ('django.contrib.gis.db.models.fields.PointField', [], {}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'risk_management_site.carlocationshistory': {
            'Meta': {'object_name': 'CarLocationsHistory'},
            'car': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'car_locations'", 'to': "orm['risk_management_site.Car']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leaveing_location_date': ('django.db.models.fields.DateTimeField', [], {}),
            'location': ('django.contrib.gis.db.models.fields.PointField', [], {})
        }
    }

    complete_apps = ['risk_management_site']