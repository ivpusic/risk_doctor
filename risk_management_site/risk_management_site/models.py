from django.contrib.gis.db import models
import os
from datetime import datetime
from risk_management_site import settings

def getUploadPath(self, filename):
    dir = '%s' % (settings.MEDIA_ROOT)
    if not os.path.exists(dir):
        os.makedirs(dir)
    return '%s/%s' % (settings.MEDIA_URL, filename)

class Car(models.Model):

    CAR_TYPES_CHOICES = (
        ('police', 'Police'),
        ('ambulance', 'Ambulance'),
        ('firefighters', 'Fire Fighters'),
        ('forestservice', "Forest Service")
    )

    CAR_STATUS = (("Free", "Free"), ("Busy", "Busy"))
    
    picture = models.TextField(editable=False)
    point = models.PointField()
    comming_location_date = models.DateTimeField(editable=False)
    type = models.CharField(max_length=50, choices=CAR_TYPES_CHOICES)
    contact = models.TextField()
    capacity_of_car = models.IntegerField()
    num_of_drivers = models.IntegerField()
    status = models.CharField(max_length=50, choices=CAR_STATUS)
    
    objects = models.GeoManager()

    def save(self):

        if (self.type == "firefighters"):
            self.picture = "site_media/static/img/firefighters.png"

        if (self.type == "ambulance"):
            self.picture = "site_media/static/img/ambulance.png"
            
        if (self.type == "police"):
            self.picture = "site_media/static/img/police.png"

        if (self.type == "forestservice"):
            self.picture = "site_media/static/img/forestservice.png"

        self.comming_location_date = datetime.now()
            
        super(Car, self).save()
    
    def __unicode__(self):
        return self.type

class CarLocationsHistory(models.Model):
    leaveing_location_date = models.DateTimeField()
    location = models.PointField()
    car = models.ForeignKey(Car, related_name="car_locations")

    