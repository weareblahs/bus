// SPECIFIC FOR RAPID KL MRT FEEDER DATA ONLY
// trip_headsign in trips = route name
// possibly using a similar system to rapid penang

import fs from "fs";
import csvParser from "csv-parser";

const routes = [];
const stopTimes = [];
const stops = [];
const trips = [];

// parse stopTimes
await new Promise((resolve, reject) => {
  fs.createReadStream("mrtfeeder/routes.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      routes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse routes
await new Promise((resolve, reject) => {
  fs.createReadStream("mrtfeeder/stop_times.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stopTimes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse stops
await new Promise((resolve, reject) => {
  fs.createReadStream("mrtfeeder/stops.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stops.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

await new Promise((resolve, reject) => {
  fs.createReadStream("mrtfeeder/trips.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      trips.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// generate station data
const stations = [];
stops.forEach((s) => {
  stations.push({
    id: parseInt(s.stop_id),
    name: s.stop_name,
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
    routeName: r.route_long_name, // route id (usually route number)
    routeShortName: "", // general name for route
    // NOTE: route colors are unavailable
    // The following route colors are loosely based off the
    // feeder bus LED display
    routeColor: "000000", // styling: bg color
    routeTextColor: "FF0D00", // styling: fg color
  };
  initialData.routeShortName = trips.find(
    (t) => t.route_id === initialData.routeId,
  ).trip_headsign;

  // generate routeStations
  let stn = [];
  const firstTripId = trips.find((t) => t.route_id === r.route_id).trip_id;
  const tripIdStn = stopTimes.filter((st) => st.trip_id === firstTripId);
  tripIdStn.forEach((f) => {
    stn[parseInt(f.stop_sequence) - 1] = parseInt(f.stop_id);
  });

  const rev = [];
  // generate reverse route stations
  const firstFoundRevTripId = trips.find(
    (t) => t.route_id === r.route_id && t.direction_id === "0",
  );
  if (firstFoundRevTripId) {
    const tid = firstFoundRevTripId.trip_id;
    const revTIDstn = stopTimes.filter((st) => st.trip_id === tid);

    revTIDstn.forEach((f) => {
      rev[parseInt(f.stop_sequence) - 1] = parseInt(f.stop_id);
    });
  }

  file.push({
    ...initialData,
    routeStations: stn,
    routeStationsRev: JSON.stringify(rev) !== JSON.stringify(stn) ? rev : [],
  });
});

// write routes.json
fs.writeFileSync("../public/mrtfeeder/routes.json", JSON.stringify(file));

console.log(`Total found routes: ${file.length}`);
console.log(`Total found stations: ${stations.length}`);

// write stations.json
fs.writeFileSync("../public/mrtfeeder/stations.json", JSON.stringify(stations));
