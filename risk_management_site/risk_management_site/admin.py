from django.contrib.gis import admin
from risk_management_site.models import Car, CarLocationsHistory


class LocationAdmin(admin.GeoModelAdmin):
    search_fields = ['picture','point']
    list_display = ['picture', "contact", "capacity_of_car", 'num_of_drivers', 'status', 'point','type', 'comming_location_date']

admin.site.register(Car, LocationAdmin)
admin.site.register(CarLocationsHistory)
