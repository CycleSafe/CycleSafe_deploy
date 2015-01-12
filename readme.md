**## Notes:**
 This is the CycleSafe_deploy project, found here: https://github.com/zemadi/CycleSafe_deploy (python/django)
 It is a reimplementation of this project: https://github.com/zemadi/CycleSafe (groovy/rails)

**Installing into a virtual evironment is highly recommended!**
NOTE: You will need to install MySQL for running in production. If you are running this for production purposes, make sure to install MySQL before proceeding.

## Instructions for getting set up (from scratch):
1. install python 2.7
2. install pip (to get django)
3. > python get-pip.py
  
For development mode only: 
4. > pip install -r local_requirements.txt
For production mode:
4.  pip install -r prod_requirements.txt
NOTE: If you have a problem with MySQl-Python in production, follow 	  		  instructions here: http://stackoverflow.com/questions/25459386/mac-os-x-environmenterror-mysql-config-not-found

5. Get the secret key from someone already on the project. Add it as an environment variable. 
6. If you are using virtualenv, add the secret key to YOURENVIRONMENTNAME/bin/activate:
   - export SECRET_KEY='ADD_YOUR_SECRET_KEY_STRING_HERE'
7. Run Django's DB management tools: syncdb, schemamigration, and migrate. Read up on these if you don't know what they already are, THEN:
   > python manage.py syncdb
   > python manage.py schemamigration app --initial
   > python manage.py migrate app
   > python manage.py migrate tastypie
   
8. > python manage.py runserver 0.0.0.0:8000 (or leave the IP address and port 		run on your localhost default)
 
To get your own DB set up, do the following:
  For sqlite3:
  1. Create a new instance of sqlite3 in the project root, /CycleSafe_deploy
  2. Edit local_settings.py with your new DB info.
  
 For mysql:
 1. Create a new DB in MySQL.
 2. Add that info to local_settings.py or settings.py **(change settings.py only for production)**
  
Other links:
 Installers for various platforms (including Windows):
     http://www.enterprisedb.com/products-services-training/pgdownload#windows
 Windows: install Visual Studio 2008:
   http://download.microsoft.com/download/A/5/4/A54BADB6-9C3F-478D-8657-93B3FC9FE62D/vcsetup.exe
