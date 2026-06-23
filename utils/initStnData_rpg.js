import fs from "fs";
import csvParser from "csv-parser";

const stationsToGenerate = ["rapidpenang"];

const exportDir = ["rapidpenang"];

// create blank foreach from stationsToGenerate with index
stationsToGenerate.forEach(async (station, index) => {
  const targetDir = exportDir[index];

  const routes = [];
  const stopTimes = [];
  const stops = [];
  const trips = [];

  // parse stopTimes
  await new Promise((resolve, reject) => {
    fs.createReadStream(`${station}/routes.txt`)
      .pipe(csvParser())
      .on("data", (row) => {
        routes.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // parse routes
  await new Promise((resolve, reject) => {
    fs.createReadStream(`${station}/stop_times.txt`)
      .pipe(csvParser())
      .on("data", (row) => {
        stopTimes.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // parse stops
  await new Promise((resolve, reject) => {
    fs.createReadStream(`${station}/stops.txt`)
      .pipe(csvParser())
      .on("data", (row) => {
        stops.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  await new Promise((resolve, reject) => {
    fs.createReadStream(`${station}/trips.txt`)
      .pipe(csvParser())
      .on("data", (row) => {
        trips.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  const rteData = routes.map((r) => {
    const compiledInfo = {
      routeId: r.route_id,
      routeName: r.route_short_name,
      routeShortName: r.route_long_name,
      routeColor: r.route_color,
      routeTextColor: r.route_text_color,
      routeStations: [],
      routeStationsRev: [],
    };

    // get route station sequence (fwd)
    const foundTrip = trips.find(
      (tr) => tr.route_id === r.route_id && tr.direction_id === "0",
    );

    const foundTripRev = trips.find(
      (tr) => tr.route_id === r.route_id && tr.direction_id === "1",
    );
    if (foundTrip && foundTrip.length !== 0) {
      // parse from stoptimes
      const stopTime = stopTimes.filter(
        (st) => st.trip_id === foundTrip.trip_id,
      );
      stopTime.forEach((st) => {
        compiledInfo.routeStations[parseInt(st.stop_sequence) - 1] = st.stop_id;
      });
    }

    if (foundTripRev && foundTripRev.length !== 0) {
      // parse from stoptimes
      const stopTime = stopTimes.filter(
        (st) => st.trip_id === foundTripRev.trip_id,
      );
      stopTime.forEach((st) => {
        compiledInfo.routeStationsRev[parseInt(st.stop_sequence) - 1] =
          st.stop_id;
      });
    }

    // fallback
    if (
      compiledInfo.routeStations.length === 0 &&
      compiledInfo.routeStationsRev.length > 0
    ) {
      compiledInfo.routeStations = compiledInfo.routeStationsRev;
      compiledInfo.routeStationsRev = [];
    }
    return compiledInfo;
  });

  console.log(`Total found routes: ${rteData.length}`);

  // write routes.json
  fs.writeFileSync(
    `../public/${targetDir}/routes.json`,
    JSON.stringify(rteData),
  );

  // get station info
  const stopsFile = stops.map((s) => ({
    id: s.stop_id,
    name: s.stop_name,
    lat: s.stop_lat,
    lon: s.stop_lon,
  }));

  console.log(`Total found stations: ${stopsFile.length}`);

  // write stations.json
  fs.writeFileSync(
    `../public/${targetDir}/stations.json`,
    JSON.stringify(stopsFile),
  );

  // create associated (fwd/rev?)
  // relatedRoutes and relatedRoutesAlt
  const did_fwd = {};
  const did_rev = {};
  //   trips.route_id (direction_id)
  trips.forEach((t) => {
    if (t.direction_id === "1") {
      if (did_rev[t.route_id]) {
        did_rev[t.route_id].push(t.trip_id);
      } else {
        did_rev[t.route_id] = [t.trip_id];
      }
    } else {
      if (did_fwd[t.route_id]) {
        did_fwd[t.route_id].push(t.trip_id);
      } else {
        did_fwd[t.route_id] = [t.trip_id];
      }
    }
  });

  console.log("writing relatedRoutes...");
  fs.writeFileSync(
    `../public/${targetDir}/relatedRoutes.json`,
    JSON.stringify(did_fwd),
  );
  console.log("writing relatedRoutesAlt...");
  fs.writeFileSync(
    `../public/${targetDir}/relatedRoutesAlt.json`,
    JSON.stringify(did_rev),
  );
  console.log(
    `Files for ${station} (output folder: public/${targetDir}) has been generated\n`,
  );
});
