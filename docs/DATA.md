# Data structure

## `public/providers.json`

This file contains all provider names available for selection, which defines the endpoint and properties `bus?` should use afterwards.

- `name`: Provider name.
- `realtimeUrl`: GTFS-R endpoint URL.
- `id`: identifier used for parsing other properties from the endpoint, including manually generated data from static GTFS endpoints, which includes assigned bus IDs.

### Notes

- As old versions of `bus?` (including the original and `v2`) directly uses the name of the provider as an identifier, some considerations has been made to parse from a static ID instead. This includes case-sensitive names, spaces in provider names and prevention of unexpected URL errors (including prevention of using special characters such as `/`)
- State / Country is removed from the structure as it is unnecessary in the interface
