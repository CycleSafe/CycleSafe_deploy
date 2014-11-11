from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized


class AdminObjectsOnlyAuthorization(Authorization):
    def read_list(self):
        return True

    def read_detail(self):
        return True

    def create_list(self):
        return True

    def create_detail(self):
        return True

    def update_list(self, object_list, bundle):
        if bundle.request.user.is_superuser:
            return True
        else:
            raise Unauthorized("You are not allowed to make any modifications to the data.")

    def update_detail(self, object_list, bundle):
        if bundle.request.user.is_superuser:
            return True
        else:
            raise Unauthorized("You are not allowed to make any modifications to the data.")

    def delete_list(self, object_list, bundle):
        if bundle.request.user.is_superuser:
            return True
        else:
            raise Unauthorized("You are not allowed to make any modifications to the data.")

    def delete_detail(self, object_list, bundle):
        if bundle.request.user.is_superuser:
            return True
        else:
            raise Unauthorized("You are not allowed to make any modifications to the data.")