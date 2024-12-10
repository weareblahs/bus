// import fs from "fs";
// const fileContent0 = fs.readFileSync(`./stops.json`, "utf8");
// const data0 = JSON.parse(`${fileContent0}`);
// for (let i = 1; i <= 96; i++) {
//   const fileContent = fs.readFileSync(`./split_files/${i}.json`, "utf8");
//   const data = JSON.parse(`[${fileContent}]`);
//   var outData = [];
//   //   const outData
//   //   console.log(data);
//   //   console.log(fileContent);
//   data.forEach((d) => {
//     outData.push({
//       stop_name: data0.filter((data) => data.stop_id === d.stop_id)[0][
//         "stop_name"
//       ],
//       stop_lat: data0.filter((data) => data.stop_id === d.stop_id)[0][
//         "stop_lat"
//       ],
//       stop_lon: data0.filter((data) => data.stop_id === d.stop_id)[0][
//         "stop_lon"
//       ],
//       stop_id: d.stop_id,
//       stop_sequence: d.stop_sequence,
//     });
//   });
//   fs.writeFile(
//     `./files_with_station_names/${i}.json`,
//     JSON.stringify(outData, null, 4),
//     () => {
//       return "Success";
//     }
//   );
//   outData = [];
// }
// console.log("Finish process");
import { readFileSync, writeFile, promises } from "fs";
const fileContent0 = readFileSync(`./stops.json`, "utf8");
const data0 = JSON.parse(`${fileContent0}`);
const path = "./split_files";
async function ls(path) {
  const dir = await promises.opendir("./split_files");
  for await (const dirent of dir) {
    const fileContent = readFileSync(`./split_files/${dirent.name}`, "utf8");
    const data = JSON.parse(`[${fileContent}]`);
    var outData = [];
    //   const outData
    //   console.log(data);
    //   console.log(fileContent);
    data.forEach((d) => {
      outData.push({
        stop_name: data0.filter((data) => data.stop_id === d.stop_id)[0][
          "stop_name"
        ],
        stop_lat: data0.filter((data) => data.stop_id === d.stop_id)[0][
          "stop_lat"
        ],
        stop_lon: data0.filter((data) => data.stop_id === d.stop_id)[0][
          "stop_lon"
        ],
        stop_id: d.stop_id,
        stop_sequence: d.stop_sequence,
      });
    });
    writeFile(
      `./files_with_station_names/${dirent.name}`,
      JSON.stringify(outData, null, 4),
      () => {
        return "Success";
      }
    );
    outData = [];
  }
}

ls(".").catch(console.error);
