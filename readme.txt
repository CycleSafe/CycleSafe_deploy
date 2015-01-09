Notes:
 - This is the CycleSafe_deploy project, found here: https://github.com/zemadi/CycleSafe_deploy (python/django)
 - It is a reimplementation of this project: https://github.com/zemadi/CycleSafe (groovy/rails)

Instructions for getting set up (from scratch):
 - install python 2.7
 - install pip (to get django)
 > python get-pip.py
 - install django
 > pip install Django==1.6.5
 > pip install -r requirements.txt
 > python manage.py syncdb
 > python manage.py schemamigration app --initial
   installers for various platforms (including Windows):
     http://www.enterprisedb.com/products-services-training/pgdownload#windows
   Windows: add PostgreSQL bin dir to path: C:\Program Files\PostgreSQL\9.3\bin
 - Windows: install Visual Studio 2008:
   http://download.microsoft.com/download/A/5/4/A54BADB6-9C3F-478D-8657-93B3FC9FE62D/vcsetup.exe
 > pip install psycopg2
   (problem with this one...)
