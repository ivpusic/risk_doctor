from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from risk_management_site.views import HomeView, LoginView, GetCarsLocatoinView, GetLastLocationUpdate, GetCarLocations, UpdateCarStatus
from django.views.generic.simple import direct_to_template

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns("",
    #url(r"^$", direct_to_template, {"template": "homepage.html"}, name="home"),
    url(r"^admin/", include(admin.site.urls)),
    url(r"^$", LoginView.as_view(), name="login"),
    url(r"^getCarsLocations$", GetCarsLocatoinView.as_view(), name="getCars"),
    url(r"^getCarLocations/(?P<pk>\d+)$", GetCarLocations.as_view(), name="getCarLocations"),
    url(r"^updateCarStatus/(?P<pk>\d+)$", UpdateCarStatus.as_view(), name="updateCarStatus"),
    url(r"^getLastLocationUpdate$", GetLastLocationUpdate.as_view(), name="getLocationUpdate"),
    url(r"^home$", HomeView.as_view(), name="home"),                  
    url(r"^account/", include("account.urls")),
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
