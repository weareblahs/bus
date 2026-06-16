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