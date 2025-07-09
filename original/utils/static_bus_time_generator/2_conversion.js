import { writeFile } from "fs";
import csv from "csvtojson";
// temporary solution

const fnt0 = `./penang/stop_times.txt`;
const fnt1 = `./kl/stop_times.txt`;
const fnt2 = `./kuantan/stop_times.txt`;

function convert() {
  csv()
    .fromFile(fnt0)
    .then((jsonObj) => {
      let nd = [];
      jsonObj.forEach((o) => {
        nd.push({
          id: o.trip_id,
          time: o.arrival_time,
          stop: o.stop_id,
        });
      });
      writeFile(
        "../../public/data/rapidPenang_static_time_data.json",
        JSON.stringify(nd),
        () => {
          return "Write successful";
        }
      );
    });

  csv()
    .fromFile(fnt1)
    .then((jsonObj) => {
      let nd = [];
      jsonObj.forEach((o) => {
        nd.push({
          id: o.trip_id,
          time: o.arrival_time,
          stop: o.stop_id,
        });
      });
      writeFile(
        "../../public/data/rapidKL_static_time_data.json",
        JSON.stringify(nd),
        () => {
          return "Write successful";
        }
      );
    });

  csv()
    .fromFile(fnt2)
    .then((jsonObj) => {
      let nd = [];
      jsonObj.forEach((o) => {
        nd.push({
          id: o.trip_id,
          time: o.arrival_time,
          stop: o.stop_id,
        });
      });
      writeFile(
        "../../public/data/rapidKuantan_static_time_data.json",
        JSON.stringify(nd),
        () => {
          return "Write successful";
        }
      );
    });
}
convert();
