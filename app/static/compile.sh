#!/bin/sh

echo 'Running JSX Compiler'

jsx -x jsx jsx js --no-cache-dir --watch &

echo 'Running SASS Compiler'

sass --watch --sourcemap=none stylesheets/scss:stylesheets/css 
