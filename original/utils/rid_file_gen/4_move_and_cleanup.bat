@echo off
echo "Deleting existing trips file..."
del ..\..\src\privData\trips.json -y
echo "Replacing with new trips file..."
move trips_generated.json ..\..\src\privData\trips.json
echo "Copying files to v2..."
copy ..\..\src\privData\trips.json ..\..\..\app\src\internalData\trips.json
echo "Deleting unused files..."
echo "Please confirm if asked to delete directory."
del "prasarana@category=rapid-bus-penang" -y
del "prasarana@category=rapid-bus-kl" -y
del "prasarana@category=rapid-bus-kuantan" -y
rmdir /s penang
rmdir /s kl
rmdir /s kuantan