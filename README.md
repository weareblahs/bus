# bus?

...yes, that is the project name. Keep it simple.

# What's this?

This is a simple-to-use bus tracker that utilizes the GTFS realtime feed from the open data by Malaysian Government, which is then used to track buses. Data is provided by Prasarana via data.gov.my.

# Status

| Provider          | Data source                               | Status    | Remarks                                                                                                    |
| ----------------- | ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| rapidPenang       | `data.gov.my` GTFS-Realtime data (Direct) | Available | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| rapidKL           | `data.gov.my` GTFS-Realtime data (Direct) | Available | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| rapidKuantan      | `data.gov.my` GTFS-Realtime data (Direct) | Available | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| myBAS Johor Bahru | `data.gov.my`                             | Planned   |                                                                                                            |

### What does "Direct" mean?

"Direct" means that the source fetches the available API endpoints on `data.gov.my` instead of relying on external APIs.

# Issues

- Global: Station info inaccurate for some stations (previous, current, next). Please see myRapid PULSE app for accurate info. Location data is accurate.
  - Known ones include: rapidPenang (for mainland and loop). Please do help me confirm about accuracy of rapidKL and rapidKuantan data.
- Global: Some data shows "unknown location" for all 3 station placeholders. This is due to some bugs on the `getNearest` code.
- Global: If the array is blank (no data), nothing will be shown except for "Bus info". There will be a placeholder soon.
- Global: Searching for loop routes will result in `getNearest` counting the first appearance of the station instead of the second appearance.

# Disclaimer

Do note that the data here is not completely accurate - it is recommended to check for myRapid PULSE (dynamic) or Google Maps (static) for more accurate info for bus arrival times.

# About station data

Station names (including route names) are stored as a static JSON file under the `data/[STATE]/[PROVIDER_NAME]/StnInfo` directory, while the file names being `[ROUTE_NUMBER][A or B].json`. For the `A` or `B` suffix:

- `A` is the forward position. (example: `301A` directs to `JETI - RELAU` in rapidPenang)
- `B` is the reverse position. (example: `301B` directs to `RELAU - JETI` in rapidPenang)

  Data includes:

- Station name is stored under `stop_name`.
- Latitude and Longitude of the station are stored respectively under `stop_lat` and `stop_long`.
- Stop ID are stored under `stop_id`.
- Station sequence are stored under `stop_sequence`.
  These data are originally from the open data mentioned as a GTFS data ZIP file (converted to JSON from CSV and removed duplicate entries for easy conversion).
- Loop routes (example CAT in Penang) does not parses the nearest station correctly. When the station repeats, it shows the previous and next stations being the previous and next stations of the first appearance of this station on the route. This might be related to latitude and longitude data - might change the nearest algorithm to parse with the static data.

# Other plans for this project

- Crowdsourced bus information (including bus type and others)
- Crowdsources bus status, which user can report if the bus gets delayed and other info
- Pin favorite bus routes so it will appear when web app launched
- Native Android version

# Where can I see this project?

Currently in beta - which can be accessed via [https://bqm.vercel.app](https://bqm.vercel.app).
