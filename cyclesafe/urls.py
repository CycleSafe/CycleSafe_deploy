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
    url(r'report/', 'app.views.report_hazards', name='report'),
    url(r'trip_planner/', 'app.views.trip_planner', name='trip_planner'),

    url(r'^api/', include(v1_api.urls)),
    url(r'^admin/', include(admin.site.urls)),

	# debugging urls
    url(r'^debug/all_hazards/', 'app.views.print_hazards', name='all_hazards'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
