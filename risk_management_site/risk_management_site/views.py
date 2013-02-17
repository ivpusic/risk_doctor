from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.generic import ListView, View, TemplateView, DetailView
from account.forms import SignupForm, LoginUsernameForm
import account.views
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required, permission_required
import account.forms
from risk_management_site.models import Car, CarLocationsHistory
from django.core import serializers
import json

class LoginView(account.views.LoginView):
    template_name = "loginpage.html"
    form_class = account.forms.LoginUsernameForm

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            
            context = { 
                'user': self.request.user,
            }
            return redirect("home")
            
        else:
            context = {
                'login_form': LoginUsernameForm,
                'signup_form': SignupForm, 
            }
            return self.render_to_response(context)

class HomeView(TemplateView):
    template_name = "homepage.html"
    
class GetCarsLocatoinView(View):        

    def getLocations(self):
        queryset = Car.objects.all()
        cars = []
        for car in queryset:
            cars.append({"id": car.id, "lat": car.point.x, "lon": car.point.y, "picture": car.picture, "type": car.type, "contact": car.contact, "capacity": car.capacity_of_car, "drivers": car.num_of_drivers, "status": car.status})
        return cars

    def get(self, *args, **kwargs):
        data = json.dumps(self.getLocations())
        return HttpResponse(data)

class GetCarLocations(View):

    def getLocations(self, pk):
        _car = Car.objects.get(id=pk)
        queryset = CarLocationsHistory.objects.filter(car=_car)
        locations = []
        
        for location in queryset:
            locations.append({"lat": location.location.x, "lon": location.location.y})

        locations.append({"lat": _car.point.x, "lon": _car.point.y})
        return locations
    
    def get(self, request, pk, *args, **kwargs):
        return HttpResponse(json.dumps(self.getLocations(pk)))

class UpdateCarStatus(View):

    def get(self, request, pk, *args, **kwargs):
        car = Car.objects.get(id=pk)
        car.status = request.GET.get('status', '')
        car.save()
        return HttpResponse("OK")
        
        
class GetLastLocationUpdate(View):

    def getLastLocationUpdate(self):
        car = Car.objects.order_by("-comming_location_date")[0]

        return {"id": car.id, "lat": car.point.x, "lon": car.point.y}
    
    def get(self, *args, **kwargs):
        data = json.dumps(self.getLastLocationUpdate())
        return HttpResponse(data)
        
