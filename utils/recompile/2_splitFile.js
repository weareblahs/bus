import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const inputFile = "./stop_times.json";
const outputDir = "split_files";

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

const fileContent = readFileSync(inputFile, "utf8");
const data = JSON.parse(`${fileContent}`);

let currentFile = [];
let fileCounter = 1;

for (let i = 0; i < data.length; i++) {
  currentFile.push(data[i]);

  // Check for split condition: stop_sequence resets to 1 AND stop_id is the same
  if (
    (i + 1 < data.length && data[i + 1].stop_sequence === "1") ||
    i === data.length - 1
  ) {
    const outputFile = join(
      outputDir,
      `${data[i]["stop_headsign"]}_${fileCounter}.json`
    );
    writeFileSync(
      outputFile,
      currentFile.map((item) => JSON.stringify(item)).join(",\n")
    );

    currentFile = [];
    fileCounter++;
  }
}

console.log(`Split into ${fileCounter - 1} files in ${outputDir} directory`);
