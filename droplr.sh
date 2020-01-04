#!/bin/sh -e
# Take a screenshot of an area of the screen, upload it to Drolpr via the Drolp JS API, and copy the shortlink to the clipboard.

# The base location of this file.
APP_DIR=~/bin/droplr;

# The location to store the screenshot temporarily until it is uploaded to Droplr
TEMP_DIR=./screenshots;

# The name of the file
FILE_NAME=Screenshot_`date +%Y-%m-%d-%H:%M`.png;

# The complete path to the file.
FILE_PATH=$TEMP_DIR/$FILE_NAME;

cd $APP_DIR;

if [ ! -f ./config.json ]; then
  echo "Couldn't find config.json. Did you remember to setup your credentials?";
  exit;
fi

if [ ! -d ./node_modules ]; then
  npm install;
fi;

[ -d $TEMP_DIR ] || mkdir -p $TEMP_DIR;

# Select an area and save the screenshot to a temp file.
gnome-screenshot -a -f $FILE_PATH;

# Use the Drolpr JS API to post the screenshot.
URL=`node droplr.js -f $FILE_PATH -t $FILE_NAME`;

echo $URL | tr -d '[:space:]' | xclip -selection clipboard;

# Pop up a small notification
notify-send "Copied $URL to clipboard";

# Remove the temp file.
rm $FILE_PATH;

exit;
