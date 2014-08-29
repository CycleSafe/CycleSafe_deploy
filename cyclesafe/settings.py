"""
Django settings for cyclesafe project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

import os
import os.path

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '9)3#6^1+)p8mx=8kev8$!)i2-ssjc*%(kbq^yr8ovj$$2j5i$5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True


BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'djangobower',
    'app',
    'south',
    'tastypie',
    'bootstrap3_datetime'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
)

ROOT_URLCONF = 'cyclesafe.urls'

WSGI_APPLICATION = 'cyclesafe.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES_SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DATABASES_POSTGRES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cyclesafe',
        'USER': 'cyclesafe',
        'PASSWORD': 'codeforsanjose',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

#DATABASES = DATABASES_POSTGRES
DATABASES = DATABASES_SQLITE

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# MEDIA_ROOT = '/app/static/media/'
MEDIA_URL = '/static/media/'


#TASTYPIE_SWAGGER_API_MODULE = "tastypie_tutorial.urls.v1_api"

TASTYPIE_FULL_DEBUG = True
API_LIMIT_PER_PAGE = 0


# # Parse database configuration from $DATABASE_URL
# import dj_database_url
# DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# import os
# import os.path
#

# Static asset configuration
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# STATIC_ROOT = '/cyclesafe/app/static/'

ROOT_PATH = os.path.dirname(__file__)

STATIC_URL = '/static/'
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'djangobower.finders.BowerFinder',
    'compressor.finders.CompressorFinder',
)
BOWER_COMPONENTS_ROOT = os.path.join(BASE_DIR, "app/static")
BOWER_INSTALLED_APPS = (
    'foundation',
    "compressor",
)
COMPRESS_PRECOMPILERS = (
        ('text/x-sass', 'sass --compass "{infile}" "{outfile}"'),
        ('text/x-scss', 'sass --scss --compass -I "%s/bower_components/foundation/scss" "{infile}" "{outfile}"' % BOWER_COMPONENTS_ROOT),
    )
# STATICFILES_DIRS = (
#     os.path.join(BASE_DIR, '../app/static'),
# )

# May need this later if we continue to have DB merge issues.
# try:
#     from local_settings import *
# except ImportError:
#     pass
