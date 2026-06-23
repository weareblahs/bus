@echo off
@REM NOTE: Script requires wget (preinstalled on win10+) and 7-zip File Manager
echo Downloading required files...
wget -O rapidkl.zip "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl"
md rapidkl
tar -xf rapidkl.zip -C "rapidkl"
wget -O mrtfeeder.zip "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-mrtfeeder"
md mrtfeeder
tar -xf mrtfeeder.zip -C "mrtfeeder"
wget -O rapidpenang.zip "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-penang"
md rapidpenang
tar -xf rapidpenang.zip -C "rapidpenang"
echo Deleting original files...
del rapidkl.zip -y
del mrtfeeder.zip -y
del rapidpenang.zip -y
echo Running all required scripts...
node initStnData_rkl.js
node initStnData_mrt.js
node initStnData_rpg.js
@REM This uses coreutils for windows
@REM which can be found on https://github.com/microsoft/coreutils
@REM
@REM ...the actual reason i'm using it is because i prefer linux
@REM commands over windows. if you think about it. man, isn't rm
@REM -rf that wonderful on removing folders?
rm -rf mrtfeeder
rm -rf rapidpenang
rm -rf rapidkl