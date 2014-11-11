from django.conf import settings
from tastypie.authentication import Authentication
from tastypie.authorization import DjangoAuthorization
from tastypie.bundle import Bundle
from tastypie.fields import CharField
from tastypie.resources import ModelResource, Resource
from app.models import Hazard


# Need to limit deletes, etc. only to admin
class HazardResource(ModelResource):
    class Meta:
        max_limit = None
        queryset = Hazard.objects.all()
        resource_name = "hazard"
        authentication = Authentication()
        authorization = DjangoAuthorization()
    def dehydrate_date_time(self, bundle):
        return u"{0}".format((bundle.obj.date_time).strftime('%m-%d-%Y, %I:%M %p'))
    # Get the actual value of choice fields from the form, instead of the machine value. See models.HAZARD_CHOICE.
    def dehydrate_hazard_type(self, bundle):
        return u"{0}".format(bundle.obj.get_hazard_type_display())
    def dehydrate_user_type(self, bundle):
        return u"{0}".format(bundle.obj.get_user_type_display())

######################
# Non-Model Resource #
######################

class Version(object):
    def __init__(self, identifier=None):
        self.identifier = identifier


class VersionResource(Resource):
    identifier = CharField(attribute='identifier')

    class Meta:
        resource_name = 'version'
        allowed_methods = ['get']
        object_class = Version
        include_resource_uri = False

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.identifier
        else:
            kwargs['pk'] = bundle_or_obj['identifier']

        return kwargs

    def get_object_list(self, bundle, **kwargs):
        return [Version(identifier=settings.VERSION)]

    def obj_get_list(self, bundle, **kwargs):
        return self.get_object_list(bundle, **kwargs)