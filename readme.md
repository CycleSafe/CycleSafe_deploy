## Frontend Build Instructions

This branch uses [React.js](http://facebook.github.io/react/) as a frontend framework and [SASS](http://sass-lang.com/) for stylesheets. 

### TLWNR (Too Long Will Not Read)

`jsx -x jsx jsx js --no-cache-dir` will compile JSX files to Js

`sass --watch scss/app.scss:css/app.css` will compile SASS files to CSS

### Sublime Plugins

If you use Sublime Text editor, you can install the following plugins to make your JSX and SASS development a lot easier. If you've never used Sublime plugins (gasp!), you can quickly get up to speed [here](https://packagecontrol.io/installation).

[JSX Syntax Highlighting](https://packagecontrol.io/packages/ReactJS)

[SASS/SCSS Syntax Highlighting](https://packagecontrol.io/packages/Sass)

### Compiling JSX to Js

React uses a type of markup called "JSX" which allows us to write our HTML code inside the `render` methods of React classes. Since HTML markup is not Javascript compliant, we cannot simply use the `.jsx` files. In order to compile `.jsx` to `.js`, we need to use [react-tools](https://www.npmjs.com/package/react-tools), an npm module that compiles JSX to Js. 

1. `npm install -g react-tools`
2. cd into `/app/static/` where you can see the `js/` and `jsx/` directories
3. run `jsx -x jsx jsx js --no-cache-dir` to compile once. Append `--watch` for it to continuously watch for changes

Explanation of command in order:

`jsx` name of executable, runs via Node.js

`-x jsx` the input fules will have the file extension `.jsx`

`jsx` the directory in which the input `.jsx` files reside

`js` the directory in which the output `.js` files reside

`--no-cache-dir` react-tools creates a cache directory for optimization without this command. It's optional

`--watch` react-tools will autocompile `jsx/` as you save your file

If you look in the `js/` directory you will see that all the JSX markup has been compiled to plain Javascript. Note that you can write the React render methods using plain Javascript to begin with, but a lot of times it's easier to use JSX markup. Also note that your HTML file only ever reads from the `js/` directory and doesn't know that `jsx/`even exists.

### Compiling SASS to CSS

SASS is an arguably *better* way to write CSS. It allows you to easily encapsulate styles, define variables, and supports mixins (functions). Like JSX, SASS has to be processed into CSS in order for it to be used. 

1. `gem install sass`
2. cd into `/app/static/stylesheets`
3. run `sass --watch scss/app.scss:css/app.css`

The file name on the left of the colon is the input `.scss` and the file name on the right of the colon is the output `.css`. Your HTML will only ever read from `css/`and doesn't know that `scss/` even exists.

If you're confused about `.scss` and `.sass` read [this](http://thesassway.com/editorial/sass-vs-scss-which-syntax-is-better). Basically, they are both syntaxes for writing SASS and have subtle differences. `.scss` is strictly typed and is representative of regular CSS. 

#### What's Bourbon?

[Bourbon](http://bourbon.io/) is a SASS mixin library. I mainly use it to "forget about writing vendor prefixes". 

### Moving Forward

Right now there's only two commands needed to build our frontend but this could quickly escalate to more. We should thinking about using a workflow tool like [GulpJs](http://gulpjs.com/) to smoothen the process.

## Instructions for getting set up (from scratch):


** Notes:**
 This is the CycleSafe_deploy project, found here: https://github.com/zemadi/CycleSafe_deploy (python/django)
 It is a reimplementation of this project: https://github.com/zemadi/CycleSafe (groovy/rails)

## Get started with CycleSafe
#### We make roads safer for everyone.

CycleSafe allows cyclists and pedestrians to view and report road hazards.
This project is part of <a href="http://codeforsanjose.com/">Code for San Jose</a>, a <a href="https://www.codeforamerica.org/">Code for America</a> brigade.

### Instructions to run CycleSafe locally
**Installing into a virtual evironment is highly recommended!**

1. install python 2.7
2. install pip and (if using Linux) python-dev
3. > python get-pip.py
 
4. Install requirements.
 For local mode only: 
   > pip install -r local_requirements.txt
  
  NOTE: If you have a problem with MySQl-Python in production, follow instructions here: http://stackoverflow.com/questions/25459386/mac-os-x-environmenterror-mysql-config-not-found

5. Django requires that every project use a secret key. Generate a local settings file containing a local secret key (credit to <a href="https://github.com/netinept">@netinept</a> for the idea):
 > KEY="$(openssl rand -base64 40)" && printf "SECRET_KEY = '%s' \nDEBUG = True \nTEMPLATE_DEBUG = True" $KEY > ./cyclesafe/local_settings.py

6. Follow the instructions to make sure your DB is set up properly.
  To get your own DB set up, do the following:
  
  For sqlite3:
   1. Create a new instance of sqlite3 in the project root, /CycleSafe_deploy
   2. Edit local_settings.py with your new DB info.
   3. Redo schemamigration and migrate in step 7.
  
  
 For mysql:
   1. Create a new DB in MySQL.
   2. Add that info to local_settings.py (don't change settings.py)
   3. Redo schemamigration and migrate in step 7.

7. Run Django's DB management tools: syncdb, schemamigration, and migrate. Read up on these if you don't know what they already are, THEN:
   > python manage.py syncdb

   > python manage.py schemamigration app --initial
   
   > python manage.py migrate app
   
   > python manage.py migrate tastypie
   
8. Run your local server
  > python manage.py runserver 0.0.0.0:8000 (or leave the IP address and port run on your localhost default)
  
Other links:

 Installers for various platforms (including Windows):
     http://www.enterprisedb.com/products-services-training/pgdownload#windows

 Windows: install Visual Studio 2008:
   http://download.microsoft.com/download/A/5/4/A54BADB6-9C3F-478D-8657-93B3FC9FE62D/vcsetup.exe
