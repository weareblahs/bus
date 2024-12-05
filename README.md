# bus?

...yes, that is the project name. Keep it simple.

# What's this?

This is a simple-to-use bus tracker that utilizes the GTFS realtime feed from the open data by Malaysian Government, which is then used to track buses. Data is provided by Prasarana via data.gov.my.

# Currently adding

- rapidPenang

# Soon to be available

- rapidKL (buses only)
- rapidKuantan (buses only)
- myBAS

# About station data

Station names (including route names) are stored as a static JSON file under the `data/[STATE]/[PROVIDER_NAME]StnInfo` directory, while the file names being `[ROUTE_NUMBER][A or B].json`. For the `A` or `B` suffix:

- `A` is the forward position. (example: `301A` directs to `JETI - RELAU` in rapidPenang)
- `B` is the reverse position. (example: `301B` directs to `RELAU - JETI` in rapidPenang)
  Data includes:
- Station name is stored under `stop_name`.
- Latitude and Longitude of the station are stored respectively under `stop_lat` and `stop_long`.
- Stop ID are stored under `stop_id`.
- Station sequence are stored under `stop_sequence`.
  These data are originally from the open data mentioned as a GTFS data ZIP file (converted to JSON from CSV and removed duplicate entries for easy conversion).

# Where can I see this project?

Coming soon.
