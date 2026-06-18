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
  fs.createReadStream("rapidpenang/routes.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      routes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse routes
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidpenang/stop_times.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stopTimes.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

// parse stops
await new Promise((resolve, reject) => {
  fs.createReadStream("rapidpenang/stops.txt")
    .pipe(csvParser())
    .on("data", (row) => {
      stops.push(row);
    })
    .on("end", resolve)
    .on("error", reject);
});

await new Promise((resolve, reject) => {
  fs.createReadStream("rapidpenang/trips.txt")
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

// lat_alt and lon_alt
const filteredStationNames = [...new Set(stations.map((st) => st.name))];
filteredStationNames.forEach((fsn) => {
  const similarStnName = stations.filter((st) => st.name === fsn);
  if (similarStnName.length > 1) {
    // placeholder: actual alt assignment happens after routes (file) is generated
  }
});

const file = [];

// generate routes data
routes.forEach((r) => {
  let initialData = {
    routeId: r.route_id, // route id used for parsing
    routeName: r.route_long_name, // route id (usually route number)
    routeShortName: "", // general name for route
    // NOTE: route colors are unavailable
    // The following route colors are loosely based off the bus display
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

  // generate reverse route stations
  const rev0 = [];
  const rev1 = [];
  let rev = [];

  const firstFoundRevTripId = trips.find(
    (t) => t.route_id === r.route_id && t.direction_id === "0",
  );
  if (firstFoundRevTripId) {
    const tid = firstFoundRevTripId.trip_id;
    const revTIDstn = stopTimes.filter((st) => st.trip_id === tid);

    revTIDstn.forEach((f) => {
      rev0[parseInt(f.stop_sequence) - 1] = parseInt(f.stop_id);
    });
  }

  const firstFoundRevTripId1 = trips.find(
    (t) => t.route_id === r.route_id && t.direction_id === "1",
  );
  if (firstFoundRevTripId1) {
    const tid = firstFoundRevTripId1.trip_id;
    const revTIDstn = stopTimes.filter((st) => st.trip_id === tid);

    revTIDstn.forEach((f) => {
      rev1[parseInt(f.stop_sequence) - 1] = parseInt(f.stop_id);
    });
  }

  // if both have data then begin comparision
  if (rev0 && rev1) {
    if (rev0 !== stn) {
      rev = rev1;
    } else if (rev1 !== stn) {
      rev = rev0;
    }
  }

  file.push({
    ...initialData,
    routeStations: stn,
    routeStationsRev: JSON.stringify(rev) !== JSON.stringify(stn) ? rev : [],
  });
});

// write routes.json
fs.writeFileSync("../public/rapidpenang/routes.json", JSON.stringify(file));

fs.writeFileSync(
  "../public/rapidpenang/stations.json",
  JSON.stringify(stations),
);

console.log(`Total found routes: ${file.length}`);
console.log(`Total found stations: ${stations.length}`);

// generate trips file
const tripsFound = {};
const tripsFoundAlt = {};
// generates multiple files for trips and alternative trips if have

trips.forEach((t) => {
  // using the same logic above, check if the position is expected
  if (t.direction_id === "1") {
    tripsFoundAlt[t.route_id] = tripsFoundAlt[t.route_id] || [];
    tripsFoundAlt[t.route_id].push(t.trip_id);
  } else {
    tripsFound[t.route_id] = tripsFound[t.route_id] || [];
    tripsFound[t.route_id].push(t.trip_id);
  }
});

console.log("Generation complete!");
console.log("Writing to relatedRoutes.json...");
fs.writeFileSync(
  "../public/rapidpenang/relatedRoutes.json",
  JSON.stringify(tripsFound),
);

console.log("Writing to relatedRoutesAlt.json...");
fs.writeFileSync(
  "../public/rapidpenang/relatedRoutesAlt.json",
  JSON.stringify(tripsFoundAlt),
);
