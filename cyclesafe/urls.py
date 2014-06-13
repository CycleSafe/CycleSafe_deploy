from django.conf.urls import patterns, include, url

from django.contrib import admin
from tastypie.api import Api
from app.api.resources import HazardResource

admin.autodiscover()

v1_api = Api(api_name="v1")
v1_api.register(HazardResource())

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'app.views.index', name='index'),

    url(r'^api/', include(v1_api.urls)),
    url(r'^admin/', include(admin.site.urls)),
)
