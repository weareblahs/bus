// SPECIFIC FOR RAPID KL GTFS DATA ONLY
// gtfs static data for rapid penang requires post processing

import fs from "fs";
import csvParser from "csv-parser";

const routes = [];
const stopTimes = [];
const stops = [];

// parse stopTimes
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidkl/routes.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      routes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse routes
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidkl/stop_times.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stopTimes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse stops
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidkl/stops.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stops.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// generate station data
const stations = [];
stops.forEach((s) => {
  stations.push({
    id: parseInt(s.stop_id),
    name: s.stop_name.split(" ").slice(1).join(" "),
    desc: s.stop_desc,
    lat: s.stop_lat,
    lon: s.stop_lon,
  });
});

const file = [];

// generate routes data
routes.forEach((r) => {
  let initialData = {
    routeId: r.route_id, // route id used for parsing
    routeName: r.route_short_name, // route id (usually route number)
    routeShortName: r.route_long_name, // general name for route
    routeColor: r.route_color, // styling: bg color
    routeTextColor: r.route_text_color, // styling: fg color
  };

  // generate routeStations
  const routeTripId = stopTimes.find((f) =>
    f.trip_id.includes(r.route_id),
  )?.trip_id;
  if (routeTripId) {
    // process data
    const stn = [];
    const filtered = stopTimes.filter((tid) => tid.trip_id === routeTripId);
    filtered.forEach((f) => {
      stn[parseInt(f.stop_sequence) - 1] = parseInt(f.stop_id);
    });
    initialData.routeStations = stn;
  } else {
    // if there is no data then push blank array
    initialData.routeStations = [];
  }
  file.push(initialData);
});

// write routes.json
fs.writeFileSync("../public/rapidkl/routes.json", JSON.stringify(file));

console.log(`Total found routes: ${file.length}`);
console.log(`Total found stations: ${stations.length}`);

// write stations.json
fs.writeFileSync("../public/rapidkl/stations.json", JSON.stringify(stations));
