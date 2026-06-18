# bus?

...yes, that is the project name. Keep it simple. It's originally called "Is there any bus for this route near me?" but it's too long.

### Project note

This is a complete rewrite of `bus?`. The code for the original and `v2` version of `bus?` can be found on specific branches:

- `bus?`: [bqm-legacy-v1](https://github.com/weareblahs/bus/tree/bqm-legacy-v1)
- `bus?` v2: [bqm-legacy-v2](https://github.com/weareblahs/bus/tree/bqm-legacy-v1)

# What's this?

This is a simple-to-use bus tracker that utilizes the GTFS realtime feed from the open data by Malaysian Government, which is then used to track buses. Data is provided by Prasarana via data.gov.my.

# Status

_NOTE: Some station stop data is inaccurate due to stop estimation between current coordinates and static station data_

| Provider       | Status    | Remarks                                                                                            |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| Rapid Penang   | Available |                                                                                                    |
| Rapid KL       | Available | Due to endpoint issues for the main Rapid KL, realtime data is only available for MRT Feeder buses |
| BAS.my network | Planned   |                                                                                                    |

Do note that data refresh rate for this is hardcoded to the 30th second and the initial second of every minute (0), which follows [this specification from data.gov.my](https://developer.data.gov.my/realtime-api/gtfs-realtime#frequency-of-data-update).

# Issues

- Rapid KL: Realtime Data unavailable for regular Rapid KL lines due to no data available via the `data.gov.my` GTFS Realtime endpoint. `Txxx` (MRT Feeder) lines still can be parsed as usual. Check the official app (myRapid PULSE) for available realtime data.
- Rapid KL: Route T406B unavailable because the `stop_times.txt` file on the static GTFS data has no data available for generating as of 16 June 2026

## Issues that might be caused... due to me not checking the code carefully before deploying

For these issues, please open an issue immediately if you see it.

- "temporary datacard placeholders so no rate limits will be applied for this one" shows up instead of the normal card

# Disclaimer

Do note that the data here is not completely accurate - it is recommended to check for myRapid PULSE (dynamic) or Google Maps (static) for more accurate info for bus arrival times.

# About station data

See [here](https://github.com/weareblahs/bus/blob/main/docs/DATA.md) for more information on the structure for static data.

# Other plans for this project

- Crowdsourced bus information (including bus type and others)
- Crowdsources bus status, which user can report if the bus gets delayed and other info
- Pin favorite bus routes so it will appear when web app launched
- Geolocation, which requires an large update on route data
- Reverse searching (search for station instead of routes), which (also) requires an large update on route data

# Where can I see this project?

Currently in beta - which can be accessed via [https://b.ntyx.dev](https://b.ntyx.dev). The current instance hosted under this domain is bus? v2, which is hosted with Cloudflare Pages.

If you prefer the original bus? version, it is accessible on [https://bqm.vercel.app](https://bqm.vercel.app).

# Credits

- Data sourced from `data.gov.my` (see documentation [here](https://developer.data.gov.my/realtime-api/gtfs-static))
- Icons sourced from Font Awesome's icon library via react-icons
- `getNearest` algorithm from `https://www.geodatasource.com`, which the original license statement can be found on the `distance` function under `/src/appComponents/getNearest.jsx`.
- openrouteservice API is the instance of OSRM that this project is currently using (for bus? v2 - which for the original version (v1) it's using the OSRM demo server)
