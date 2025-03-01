# About static data

Static data is generated through scripts located at the `utils` directory of the repository, while the data is located at both `public/data` and `src/privData`.

If you are using a Windows computer, you can generate with the `1_init.bat` script under the `utils/rid_file_gen` folder. However, for static bus arrival times, run `1_init.bat` under the `utils/static_bus_time_generator` directory. All the files will be generated under the same directory and file structure as below, and user may have to create the files below to generate it. It is not guaranteed to work on all cases.

Route IDs are now static, which is generated with a (now-deleted) script on my computer. If there are new route information, I will create a new script for generation and the script will be available under the `utils` directory of this repository.

# Global parameters

- `XXXA` / `XXXB`: `XXX` defines the route number, while `A` and `B` specifies the route direction.
  - For single / loop routes, use `A` only. `B` is reserved for reverse routes (if `A` is the forward route).

# Structure

## `src/privData/providers.json`

This file stores all the providers (each as a JSON object). Other data (such as Station info, Bus Stop info, etc) are under a static directory.

```json
{
  "providerName": "rapidKL",
  "state": "Kuala Lumpur",
  "country": "Malaysia",
  "endpoint": "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana/?category=rapid-bus-kl"
}
```

- `providerName` is the provider name of the service, which will be shown throughout the entire interface. In `public/data`, the folders need to be case sensitive and follow the name of the provider as specified in this file.
- `state` is the state where the service is operated. Examples (for Malaysia) including `Penang`, `Ipoh`, `Sabah`, `Kuala Lumpur`, etc. In `public/data`, the folders need to be case sensitive and follow the name of the provider as specified in this file.
- `country` is the country displayed on the setup screen.
- `endpoint` is the URL for the GTFS Realtime `protobuf` format endpoint that the data will be parsed from.

## `src/privData/trips.json`

This file stores a list of trips related to the route stored in a JSON object called `trips`, along with the `providerName` for parsing. Do note that due to the GTFS Realtime data only storing trip IDs, this is required for the web app to find related routes.

```json
[
  {
    "providerName": "rapidPenang",
    "trips": [
      { "id": "241210010004S9", "name": "101B" },
      { "id": "241210010006S3", "name": "101B" },
      { "id": "241210010008S7", "name": "101B" },
      { "id": "241210010009S7", "name": "101B" }
    ]
  },
  {
    "providerName": "rapidKL",
    "trips": [
      { "id": "weekend_U8510_U851002_0", "name": "851A" },
      { "id": "weekend_S4060_S406002_0", "name": "SA06A" },
      { "id": "weekend_S4060_S406002_1", "name": "SA06A" },
      { "id": "weekend_S4060_S406002_2", "name": "SA06A" }
    ]
  }
]
```

(example data taken from `providers.json`, which are snippets of the data in `trips`)

### Under `providerName`

- `providerName`: The name of the provider. Must be case-sensitive.

### Under `trips`

- `id`: Trip ID, as defined in the GTFS Realtime file.
- `name`: Route number along with the direction, which will be parsed with the `public/data/STATE/PROVIDER/StnInfo` file.

## `public`

The data under this directory can be accessed via `PROTOCOL://HOSTNAME/DIRECTORY_NAME`.

## `public/data/STATE_NAME/PROVIDER.json`

This file contains the names of the route that will be parsed from the web app. Do note that the provider name and state name must be case sensitive as how the `src/privData/providers.json` store.

```json
[
  { "id": "851A", "name": "Hab Pasar Seni ~ Kompleks Mahkamah Jalan Duta" },
  { "id": "SA06A", "name": "Terminal Seksyen 19 ~ Kota Kemuning" },
  { "id": "PBD1A", "name": "Stesen MRT Semantan  ~ Damanlela Open CarPark" },
  { "id": "KLG3CA", "name": "Bandar Putera ~ Bandar Klang via Jalan Kebun" }
]
```

(example data: rapidKL routes)

- `id`: See `Global Parameters` part on top of this document for the ID syntax.
- `name`: Route name.

## `public/data/stnInfo/PROVIDER_ROUTE_ID.json`

This file contains information about the route, including the stop names.

```json
[
  {
    "stop_name": "(M1) JETTY A",
    "stop_lat": "5.414174",
    "stop_lon": "100.3422281",
    "stop_id": "12002113",
    "stop_sequence": "1"
  },
  {
    "stop_name": "Container Hotel",
    "stop_lat": "5.41415",
    "stop_lon": "100.34042",
    "stop_id": "12000007",
    "stop_sequence": "2"
  },
  {
    "stop_name": "Restoran Kapitan",
    "stop_lat": "5.41602",
    "stop_lon": "100.33892",
    "stop_id": "12001916",
    "stop_sequence": "3"
  },
  {
    "stop_name": "Kampung Kolam",
    "stop_lat": "5.41606",
    "stop_lon": "100.33669",
    "stop_id": "12000610",
    "stop_sequence": "4"
  }
]
```

(example data: rapidPenang, route 301, forward position)

- `stop_name`: The corresponding stop name for the bus station.
- `stop_lat`: The latitude for this station.
- `stop_lon`: The longitude for this station.
- `stop_id`: Internal ID used by bus providers to identify the stop. Do note that this is not used in the web app in this moment, and this will be implemented as another feature in the future.
- `stop_sequence`: The stop sequence according to the route. Previous and next station is parsed via the value of `stop_sequence` in the web app.

## `public/data/PROVIDER_static_route_data.json`

This file contains data that includes the arrival time for each station paired with the Trip ID on the provider's system.

```json
[
  { "id": "241210010004S10", "time": "19:35:00", "stop": "12002114" },
  { "id": "241210010004S10", "time": "19:35:31", "stop": "12000007" },
  { "id": "241210010004S10", "time": "19:36:14", "stop": "12001916" },
  { "id": "241210010004S10", "time": "19:36:51", "stop": "12001918" },
  { "id": "241210010004S10", "time": "19:37:20", "stop": "12001920" }
]
```

(Example data: rapidPenang)

- `id`: Trip ID for the bus. Can be paired with the route ID under `src/privData/trips.json`.
- `time`: Expected arrival time for each station. Uses a string with a 24-hour time format (HH:MM:SS).
- `stop`: Stop ID for the station. Can be paired with the stop name, latitude and longitude under `public/data/stnInfo/PROVIDER_ROUTE_ID.json`.
