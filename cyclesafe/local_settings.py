from settings import BASE_DIR
import os

# NOTE: The secret key is not included in this file. You must get it from someone on the team.

DEBUG = True
TEMPLATE_DEBUG = True

DATABASES_SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DATABASES = DATABASES_SQLITE