// SPECIFIC FOR RAPID KL GTFS DATA ONLY
// gtfs static data for rapid penang requires post processing

import fs from "fs";
import csvParser from "csv-parser";

const routes = [];
const stopTimes = [];
const stops = [];
const trips = [];

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

// parse trips
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidkl/trips.txt")
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

  // find reverse route id
  // get name, split last part, split before "via", get last value and compare w/ lowercase?
  const reversePosTrip =
    "weekday_" + initialData.routeId + "_" + initialData.routeId + "02_0";

  const reversePosTripId = trips.find((t) => t.trip_id === reversePosTrip);

  if (reversePosTripId) {
    const rstn = [];
    const tid = reversePosTripId.trip_id; // get first reverse route ID
    const filtered = stopTimes.filter((tid) => tid.trip_id === reversePosTrip);
    filtered.forEach((f) => {
      rstn[parseInt(f.stop_sequence)] = parseInt(f.stop_id);
    });
    // push final data

    if (
      JSON.stringify(rstn.filter((r) => r !== null)) !==
      JSON.stringify(initialData.routeStations)
    ) {
      initialData.routeStationsRev = initialData.routeStations;
      initialData.routeStations = rstn.filter((r) => r !== null);
    } else {
      initialData.routeStationsRev = [];
    }
  } else {
    // if there is no reverse route data then push blank array
    // in the UI it will check if this has no data
    initialData.routeStationsRev = [];
  }
  file.push(initialData);
});

// write routes.json
fs.writeFileSync("../public/rapidkl/routes.json", JSON.stringify(file));

console.log(`Total found routes: ${file.length}`);
console.log(`Total found stations: ${stations.length}`);

// write stations.json
fs.writeFileSync("../public/rapidkl/stations.json", JSON.stringify(stations));

console.log("\nGenerating trips file for current provider...");

// generate trips file
const tripsFound = {};
const tripsFoundAlt = {};
// generates multiple files for trips and alternative trips if have
// for rapid KL required information can be directly retrieved from the ID
// possible structure: WEEKTYPE_ID_[ID][POSITION]_TRIPCOUNT
trips.forEach((t) => {
  const tidToProcess = t.trip_id.split("_");

  // using the same logic above, check if the position is expected
  if (tidToProcess[2].slice(-2) === "01") {
    tripsFoundAlt[tidToProcess[1]] = tripsFound[tidToProcess[1]] || [];
    tripsFoundAlt[tidToProcess[1]].push(t.trip_id);
  } else {
    tripsFound[tidToProcess[1]] = tripsFound[tidToProcess[1]] || [];
    tripsFound[tidToProcess[1]].push(t.trip_id);
  }
});

console.log("Generation complete!");
console.log("Writing to relatedRoutes.json...");
fs.writeFileSync(
  "../public/rapidkl/relatedRoutes.json",
  JSON.stringify(tripsFound),
);

console.log("Writing to relatedRoutesAlt.json...");
fs.writeFileSync(
  "../public/rapidkl/relatedRoutesAlt.json",
  JSON.stringify(tripsFoundAlt),
);
