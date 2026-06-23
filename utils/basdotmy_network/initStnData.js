import fs from "fs";
import csvParser from "csv-parser";

const stationsToGenerate = ["mybas-alor-setar"];

const exportDir = ["mybasalorsetar"];

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
  // sample data
  ///  {
  //     "routeId": "30000019",
  //     "routeName": "401",
  //     "routeShortName": "JETI - TELUK KUMBAR",
  //     "routeColor": "19499F",
  //     "routeTextColor": "FF0D00",
  //     "routeStations": [
  //     ],
  //     "routeStationsRev": [
  //     ]
  //   },
  let rteData = [];

  routes.forEach((r) => {
    const compiledInfo = {
      routeId: r.route_id,
      routeName: r.route_short_name,
      routeShortName: r.route_long_name,
      routeColor: r.route_color,
      routeTextColor: r.route_text_color,
      routeStations: [],
      routeStationsRev: [],
    };

    // get route stations
  });
});
