## Get started with CycleSafe
#### We make roads safer for everyone.

CycleSafe allows cyclists and pedestrians to view and report road hazards.
This project is part of <a href="http://codeforsanjose.com/">Code for San Jose</a>, a <a href="https://www.codeforamerica.org/">Code for America</a> brigade.

### Instructions to run CycleSafe locally
**Installing into a virtual evironment is highly recommended!**

1. install python 2.7
2. install pip and (if using Linux) python-dev
3. > python get-pip.py

   > pip install python-dev
 
4. Install requirements.
 For local mode only: 
   > pip install -r local_requirements.txt
  
  NOTE: If you have a problem with MySQl-Python in production, follow instructions here: http://stackoverflow.com/questions/25459386/mac-os-x-environmenterror-mysql-config-not-found

5. Get the secret key from someone already on the project. Add it as an environment variable. 
6. If you are using virtualenv, add the secret key to YOURENVIRONMENTNAME/bin/activate:
 
   > export SECRET_KEY='ADD_YOUR_SECRET_KEY_STRING_HERE'

7. Follow the instructions to make sure your DB is set up properly.
  To get your own DB set up, do the following:
  
  For sqlite3:
   1. Create a new instance of sqlite3 in the project root, /CycleSafe_deploy
   2. Edit local_settings.py with your new DB info.
   3. Redo schemamigration and migrate in step 7.
  
  
 For mysql:
   1. Create a new DB in MySQL.
   2. Add that info to local_settings.py (don't change settings.py)
   3. Redo schemamigration and migrate in step 7.

8. Run Django's DB management tools: syncdb, schemamigration, and migrate. Read up on these if you don't know what they already are, THEN:
   > python manage.py syncdb

   > python manage.py schemamigration app --initial
   
   > python manage.py migrate app
   
   > python manage.py migrate tastypie
   
9. Run your local server
  > python manage.py runserver 0.0.0.0:8000 (or leave the IP address and port run on your localhost default)
  
Other links:

 Installers for various platforms (including Windows):
     http://www.enterprisedb.com/products-services-training/pgdownload#windows

 Windows: install Visual Studio 2008:
   http://download.microsoft.com/download/A/5/4/A54BADB6-9C3F-478D-8657-93B3FC9FE62D/vcsetup.exe
