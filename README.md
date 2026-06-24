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

| Provider                            | Status    | Remarks                                   |
| ----------------------------------- | --------- | ----------------------------------------- |
| Rapid Penang                        | Available |                                           |
| Rapid KL (including MRT Feeder Bus) | Available |                                           |
| BAS.MY network                      | Available | Some buses on some routes are unavailable |

Do note that data refresh rate for this is hardcoded to the 30th second and the initial second of every minute (0), which follows [this specification from data.gov.my](https://developer.data.gov.my/realtime-api/gtfs-realtime#frequency-of-data-update).

# Issues

- Rapid KL: Route T406B unavailable because the `stop_times.txt` file on the static GTFS data has no data available for generating as of 16 June 2026.
- BAS.MY: Some buses routes are unavailable due to route / bus parsing issues, which is confirmed from the _Debug Labs_ section of the web app. Do note that fixes are planned for this issue after most required features are built on the frontend.

## Issues that might be caused... due to me not checking the code carefully before deploying

For these issues, please open an issue immediately if you see it.

- "temporary datacard placeholders so no rate limits will be applied for this one" shows up instead of the normal card

# Disclaimer

Do note that the data here is not completely accurate - it is recommended to check for myRapid PULSE (dynamic) or Google Maps (static) for more accurate info for bus arrival times.

# About station data

See [here](https://github.com/weareblahs/bus/blob/main/docs/DATA.md) for more information on the structure for static data.

# Other plans for this project

- Pin favorite bus routes so it will appear when web app launched
- Geolocation, which requires an large update on route data

# Where can I see this project?

Currently in beta - which can be accessed via [https://b.ntyx.dev](https://b.ntyx.dev). The current instance hosted under this domain is bus? v2, which is hosted with Cloudflare Pages.

If you prefer the original bus? version, it is accessible on [https://bqm.vercel.app](https://bqm.vercel.app).

# Frequently Asked Questions

Q: The route is supposed to have multiple directions but the web app does not have it.
A: It might be due to parsing errors when generating required files. Please [open a new issue](https://github.com/weareblahs/bus/issues/new) so I can investigate and fix it.

Q: Other apps have data for this route's buses, but the web app does not have it.
A: This web application is designed to check realtime data of buses - data availability is subject to the realtime data availability of the Open Portal's GTFS-R endpoint. Do note that for some cases, the bus is not linked with the related route on the static JSON files used for parsing, which is a human-made issue (from me) rather than the issue from the web application. If this is a known case, please [open a new issue](https://github.com/weareblahs/bus/issues/new) so I can look into it.

Q: I want to suggest a feature.
A: Check "Other plans for this project" first to see if the feature is planned for development. If it is not on the list, please [open a new issue](https://github.com/weareblahs/bus/issues/new) so I can look into it.

# Credits

- Data sourced from `data.gov.my` (see documentation [here](https://developer.data.gov.my/realtime-api/gtfs-static))
- Icons sourced from Font Awesome's icon library via react-icons
- OpenRouteService API is the instance of OSRM that this project is currently using
- Reverse Geocoding of this web app uses Pelias by OpenRouteService which utilizes OpenStreetMap data
- Other credits can be found in the "Options" section of the web app
