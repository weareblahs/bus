# bus?

...yes, that is the project name. Keep it simple. It's originally called "Is there any bus for this route near me?" but it's too long.

# What's this?

This is a simple-to-use bus tracker that utilizes the GTFS realtime feed from the open data by Malaysian Government, which is then used to track buses. Data is provided by Prasarana via data.gov.my.

# Status

| Provider          | Data source                               | Status                  | Remarks                                                                                                    |
| ----------------- | ----------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| rapidPenang       | `data.gov.my` GTFS-Realtime data (Direct) | Available (static only) | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| rapidKL           | `data.gov.my` GTFS-Realtime data (Direct) | Available               | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| rapidKuantan      | `data.gov.my` GTFS-Realtime data (Direct) | Available (static only) | Station stop data is inaccurate due to stop estimation between current coordinates and static station data |
| myBAS Johor Bahru | `data.gov.my`                             | Planned                 |                                                                                                            |

Do note that data refresh rate for this is hardcoded to the 30th second and the initial second of every minute (0), which follows [this specification from data.gov.my](https://developer.data.gov.my/realtime-api/gtfs-realtime#frequency-of-data-update).

### What does "Direct" mean?

"Direct" means that this web app will fetch the available API endpoints on `data.gov.my` instead of relying on external APIs.

# Issues

- Migration: If a user visits the `b.ntyx.dev` instance before the migration to bus? v2, the data will not be loaded and the Settings page returns a blank screen. If you face this problem, please clear cookies on your mobile device, or visit through other browser or Incognito Mode. A fix that checks the difference between cookie data of bus? v2 and bus? v1 will be available soon.
- Global: Station info inaccurate for some stations (previous, current, next). Please see myRapid PULSE app for accurate info. Location data is accurate.
  - Known ones include: rapidPenang (for mainland and loop). Please do help me confirm about accuracy of rapidKL and rapidKuantan data.
- Global: Some data shows "unknown location" for all 3 station placeholders. This is due to some bugs on the `getNearest` code.
- Global: If the array is blank (no data), nothing will be shown except for "Bus info". There will be a placeholder soon.
- Global: Searching for loop routes will result in `getNearest` counting the first appearance of the station instead of the second appearance.
- rapidPenang and rapidKuantan: No realtime data available through this web app due to parsing reasons. Refer to myRapid PULSE for realtime bus data for these providers.
- Global: Unable to parse days through static data, which I do not understand how trip IDs work in this case
- Global: Search for static data does not work

## Issues that might be caused due to the author not checking

For these issues, please open an issue immediately if you see it.

- "temporary datacard placeholders so no rate limits will be applied for this one" shows up instead of the normal card

# Disclaimer

Do note that the data here is not completely accurate - it is recommended to check for myRapid PULSE (dynamic) or Google Maps (static) for more accurate info for bus arrival times.

# About station data

Station names (including route names) are stored as a static JSON file under the `data/stnInfo` directory, while the file names being `[PROVIDER]_[ROUTE_NUMBER][DIRECTION].json`. For the direction:

- `A` is the forward position. (example: `301A` directs to `JETI - RELAU` in rapidPenang)
- `B` is the reverse position. (example: `301B` directs to `RELAU - JETI` in rapidPenang)

  Data includes:

- Station name is stored under `stop_name`.
- Latitude and Longitude of the station are stored respectively under `stop_lat` and `stop_long`.
- Stop ID are stored under `stop_id`.
- Station sequence are stored under `stop_sequence`.
  These data are originally from the open data mentioned as a GTFS data ZIP file (converted to JSON from CSV and removed duplicate entries for easy conversion).

See [here](https://github.com/weareblahs/bus/blob/main/docs/StaticData.md) for more information on the structure for static data.

# Other plans for this project

- Crowdsourced bus information (including bus type and others)
- Crowdsources bus status, which user can report if the bus gets delayed and other info
- Pin favorite bus routes so it will appear when web app launched
- Framework-based app for Android
- Geolocation, which requires an large update on route data
- Reverse searching (search for station instead of routes), which (also) requires an large update on route data

# Where can I see this project?

Currently in beta - which can be accessed via [https://b.ntyx.dev](https://b.ntyx.dev). Alternatively, you can also access the web app via [https://bqm.vercel.app](https://bqm.vercel.app).

Do note that a new version of bus? is coming soon, which a preview of it can be seen on [https://bqmv2.vercel.app](https://bqmv2.vercel.app).

# Credits

- Data sourced from `data.gov.my` (see documentation [here](https://developer.data.gov.my/realtime-api/gtfs-static))
- Icons sourced from Font Awesome's icon library via react-icons
- `getNearest` algorithm from `https://www.geodatasource.com`, which the original license statement can be found on the `distance` function under `/src/appComponents/getNearest.jsx`.
