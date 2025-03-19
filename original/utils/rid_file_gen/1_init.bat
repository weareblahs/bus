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
echo "Creating blank trips / routes file for generation purposes..."
copy blank.json penang\trips.json
copy blank.json penang\routes.json
copy blank.json kl\trips.json
copy blank.json kl\routes.json
copy blank.json kuantan\trips.json
copy blank.json kuantan\routes.json
node 2_conversion
node 3_generate
4_move_and_cleanup