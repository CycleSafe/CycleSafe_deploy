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
    url(r'map/', 'app.views.map', name='map'),

    url(r'^api/', include(v1_api.urls)),
    url(r'^admin/', include(admin.site.urls)),

	# djmc new additions
	url(r'view_hazards/', 'app.views.view_hazards', name='view_hazards'),
	url(r'report_hazard/', 'app.views.report_hazard', name='report_hazard'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
