import fs from "fs";
import csvParser from "csv-parser";
import { compile } from "tailwindcss";

const stationsToGenerate = [
  "mybas-alor-setar",
  "mybas-ipoh",
  "mybas-johor",
  "mybas-kangar",
  "mybas-kota-bharu",
  "mybas-kuala-terengganu",
  "mybas-kuching",
  "mybas-melaka",
  "mybas-seremban-a",
  "mybas-seremban-b",
];

const exportDir = [
  "mybasalorsetar",
  "mybasipoh",
  "mybasjb",
  "mybaskangar",
  "mybaskb",
  "mybaskt",
  "mybaskuching",
  "mybasmelaka",
  "mybasseremban",
  "mybasserembanb",
];

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
    `../../public/${targetDir}/routes.json`,
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
    `../../public/${targetDir}/stations.json`,
    JSON.stringify(stopsFile),
  );

  // get stops info
  // get general basic info
});
