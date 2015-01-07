
@ECHO off
SET BASE_DIR = %~dp0
ECHO "Running grunt build"
ECHO "-------------------------------------------------------------------"
ECHO "base dir="+%BASE_DIR%
SET PATH=%PATH%;
REM npm install  grunt
REM npm install  grunt-contrib-concat
REM npm install  grunt-contrib-clean
ECHO "Done installing local node modules"
CD %BASE_DIR%
grunt --force
