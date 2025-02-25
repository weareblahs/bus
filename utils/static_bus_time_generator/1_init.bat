@echo off
echo "Downloading data for rapidPenang..."
wget https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-penang
echo "Downloading data for rapidKL..."
wget https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl
echo "Downloading data for rapidPahang..."
wget https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kuantan
echo "Creating folders (if not exist)..."
md penang kl kuantan
echo "Extracting GTFS static files..."
tar -xf prasarana@category=rapid-bus-penang -C ./penang
tar -xf prasarana@category=rapid-bus-kl -C ./kl
tar -xf prasarana@category=rapid-bus-kuantan -C ./kuantan
node 2_conversion

echo "Deleting existing trips file..."
del ..\..\src\privData\trips.json -y
echo "Replacing with new trips file..."
move trips_generated.json ..\..\src\privData\trips.json
echo "Deleting unused files..."
echo "Please confirm if asked to delete directory."
del "prasarana@category=rapid-bus-penang" -y
del "prasarana@category=rapid-bus-kl" -y
del "prasarana@category=rapid-bus-kuantan" -y
rmdir /s penang
rmdir /s kl
rmdir /s kuantan