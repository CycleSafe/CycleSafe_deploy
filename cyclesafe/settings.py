"""
Django settings for cyclesafe project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

import os
import os.path

# When running the project locally, some production settings may need to be edited, like project_dir, debug, csrf,
# staticfiles, etc.

# Example PROJECT_DIR: '/var/www/cyclesafe'
PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))

# TODO: Uncomment CSRF_COOKIE_SECURE once we have https set up? Not sure if it's needed. It's a Django recommendation.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

ALLOWED_HOSTS = ['*']

ROOT_PATH = os.path.dirname(__file__)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Turned off debugging.
DEBUG = False
TEMPLATE_DEBUG = False

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
    'widget_tweaks',
)

SECRET_KEY = os.environ['SECRET_KEY']

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES_SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DATABASES_MYSQL = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'cyclesafe',
        'USER': 'cyclesafe',
        'PASSWORD': 'codeforsanjose',
        'HOST': '',
        'PORT': '',
    }
}

try:
    import MySQLdb
    DATABASES = DATABASES_MYSQL
    print('database: using mysql')
except:
    print('database: falling back to sqlite')
    DATABASES = DATABASES_SQLITE

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'cyclesafe.urls'

WSGI_APPLICATION = 'cyclesafe.wsgi.application'

try:
    import bcrypt
    PASSWORD_HASHERS = (
        'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
        'django.contrib.auth.hashers.BCryptPasswordHasher',
        'django.contrib.auth.hashers.PBKDF2PasswordHasher',
        'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
        'django.contrib.auth.hashers.SHA1PasswordHasher',
        'django.contrib.auth.hashers.MD5PasswordHasher',
        'django.contrib.auth.hashers.CryptPasswordHasher',
    )
except:
    print('skipping bcrypt...')

TASTYPIE_FULL_DEBUG = True
TASTYPIE_DEFAULT_FORMATS = ['json']
API_LIMIT_PER_PAGE = 0

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

TEMPLATE_LOADERS = ('django.template.loaders.filesystem.Loader', 'django.template.loaders.app_directories.Loader')

# Media_url specifies the location of user-uploaded files.
MEDIA_URL = '/static/media/'
STATIC_URL = '/static/'
# NOTE: The STATIC_ROOT directory is where staticfiles need to be stored. This may need to be changed depending on
# OpenShift's requirements.
STATIC_ROOT = os.path.join(PROJECT_DIR, '..', 'static')

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'djangobower.finders.BowerFinder',
    'compressor.finders.CompressorFinder',
)

# Use local settings if available.
try:
    from local_settings import *
except ImportError:
    pass

