from django.conf.urls import patterns, include, url

from django.contrib import admin
from tastypie.api import Api
from app.api.resources import HazardResource
from django.conf import settings
from django.conf.urls.static import static

admin.autodiscover()

v1_api = Api(api_name="v1")
v1_api.register(HazardResource())

urlpatterns = patterns('',
                       # Examples:
                       url(r'^$', 'app.views.index', name='index'),

                       # djmc new additions. Zhila edited-- turned view_hazards to just index.
                       # url(r'view/', 'app.views.view_hazards', name='view_hazards'),
                       url(r'report/', 'app.views.report_hazards', name='report'),
                       url(r'map/', 'app.views.map', name='map'),

                       url(r'^api/', include(v1_api.urls)),
                       url(r'^admin/', include(admin.site.urls)),


) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
