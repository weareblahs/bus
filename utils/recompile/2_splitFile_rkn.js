import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const inputFile = "./stop_times.json";
const outputDir = "split_files";
const inputFile1 = "./trips.json"; // get route_id from trip_id
const inputFile2 = "./routes.json"; // get route_short_name

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

const fileContent = readFileSync(inputFile, "utf8");
const data = JSON.parse(`${fileContent}`);
const fileContent1 = readFileSync(inputFile1, "utf8");
const data1 = JSON.parse(`${fileContent1}`);
const fileContent2 = readFileSync(inputFile2, "utf8");
const data2 = JSON.parse(`${fileContent2}`);

let currentFile = [];
let fileCounter = 1;

for (let i = 0; i < data.length; i++) {
  currentFile.push(data[i]);
  // Check for split condition: stop_sequence resets to 1 AND stop_id is the same
  if (
    (i + 1 < data.length && data[i + 1].stop_sequence === "1") ||
    i === data.length - 1
  ) {
    // find data
    // const outFile = `${
    //   data2.filter(
    //     (d2) =>
    //       d2.route_id ===
    //       data1.filter((t) => t.trip_id === data[i]["trip_id"])[0]["route_id"]
    //   )[0]["route_short_name"]
    // }${
    //   data1.filter((t) => t.trip_id === data[i]["trip_id"])[0][
    //     "direction_id"
    //   ] == 0
    //     ? "A"
    //     : "B"
    // }.json`;
    // console.log(outFile);
    // const out2 = data2;
    // const outputFile = join(outputDir, outFile);
    // writeFileSync(
    //   outputFile,
    //   currentFile.map((item) => JSON.stringify(item)).join(",\n")
    // );
    // currentFile = [];
    // fileCounter++;
    console.log(data1.filter((t) => t.trip_id == data[i]["trip_id"]));
  }
}

console.log(`Split into ${fileCounter - 1} files in ${outputDir} directory`);
