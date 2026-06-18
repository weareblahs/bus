# Data structure

## `public/providers.json`

This file contains all provider names available for selection, which defines the endpoint and properties `bus?` should use afterwards.

- `name`: Provider name.
- `realtimeUrl`: GTFS-R endpoint URL.
- `id`: identifier used for parsing other properties from the endpoint, including manually generated data from static GTFS endpoints, which includes assigned bus IDs.

### Notes

- As old versions of `bus?` (including the original and `v2`) directly uses the name of the provider as an identifier, some considerations has been made to parse from a static ID instead. This includes case-sensitive names, spaces in provider names and prevention of unexpected URL errors (including prevention of using special characters such as `/`)
- State / Country is removed from the structure as it is unnecessary in the interface

## `public\PROVIDER_NAME`

This is generated from specific scripts under the `utils` folder. Since bus providers uses a different naming scheme (example: Rapid KL uses a different system compared to MRT Feeder Bus and Rapid Penang), specific scripts for retrieval of data is required.

### `public\PROVIDER_NAME\routes.json`

- `routeId`: Identifying Route ID in the GTFS `routes` file.
- `routeName`: Bus route number.
- `routeShortName`: Bus route name from the provider.
- `routeColor`: UI-related - background color of bus route number as displayed as badge on the web app.
- `routeTextColor`: UI-related - text color of bus route number as displayed as badge on the web app.
- `routeStations`: An array of related route IDs which can be referred at `stations.json`.
- `routeStationsRev`: Data type is same as `routeStations`. If the bus route has an alternative route, this set of routes will be used when toggled.

### `public\PROVIDER_NAME\stations.json`

- `id`: Station identifier taken from its related GTFS static data.
- `name`: Station name.
- `desc`: Station description (if have).
- `lat`: Latitude of station.
- `lon`: Longitude of station.

### `public\PROVIDER_NAME\relatedRoutes.json`

This file is a dictionary where:

- Key: Trip ID.
- Value: An array containing the Route ID and a boolean value that states the line's position.

**PROPOSED**: not implemented yet
