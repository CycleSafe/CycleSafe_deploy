Notes:
 - This is the CycleSafe_deploy project, found here: https://github.com/zemadi/CycleSafe_deploy (python/django)
 - It is a reimplementation of this project: https://github.com/zemadi/CycleSafe (groovy/rails)

Instructions for getting set up (from scratch):
Installing into a virtual evironment is highly recommended!
 - install python 2.7
 - install pip (to get django)
 > python get-pip.py
 - install django
 > pip install Django==1.6.5
 > pip install -r requirements.txt
 Create a local_settings.py file in the same folder as settings.py.
 - Add the following to that file:
  from settings import BASE_DIR
  import os
  
  DEBUG = True
  TEMPLATE_DEBUG = True
  
  DATABASES_SQLITE = {
      'default': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
      }
  }
  
  DATABASES = DATABASES_SQLITE
  
 - Get the secret key from someone already on the project. Add it as an environment variable. 
 - If you are using virtualenv, add the secret key to yourenvironmentname/bin/activate:
  export SECRET_KEY='ADD_YOUR_SECRET_KEY_STRING_HERE'
 - Create a local instance of sqlite3 in the project root, /CycleSafe_deploy
 > python manage.py syncdb
 > python manage.py schemamigration app --initial
 > python manage.py migrate app
 > python manage.py migrate tastypie
   installers for various platforms (including Windows):
     http://www.enterprisedb.com/products-services-training/pgdownload#windows
 - Windows: install Visual Studio 2008:
   http://download.microsoft.com/download/A/5/4/A54BADB6-9C3F-478D-8657-93B3FC9FE62D/vcsetup.exe
