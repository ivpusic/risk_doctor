# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Car'
        db.create_table('risk_management_site_car', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('picture', self.gf('django.db.models.fields.TextField')()),
            ('point', self.gf('django.contrib.gis.db.models.fields.PointField')()),
            ('comming_location_date', self.gf('django.db.models.fields.DateTimeField')()),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('contact', self.gf('django.db.models.fields.TextField')()),
            ('capacity_of_car', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('risk_management_site', ['Car'])

        # Adding model 'CarLocationsHistory'
        db.create_table('risk_management_site_carlocationshistory', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('leaveing_location_date', self.gf('django.db.models.fields.DateTimeField')()),
            ('location', self.gf('django.contrib.gis.db.models.fields.PointField')()),
            ('car', self.gf('django.db.models.fields.related.ForeignKey')(related_name='car_locations', to=orm['risk_management_site.Car'])),
        ))
        db.send_create_signal('risk_management_site', ['CarLocationsHistory'])


    def backwards(self, orm):
        # Deleting model 'Car'
        db.delete_table('risk_management_site_car')

        # Deleting model 'CarLocationsHistory'
        db.delete_table('risk_management_site_carlocationshistory')


    models = {
        'risk_management_site.car': {
            'Meta': {'object_name': 'Car'},
            'capacity_of_car': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
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