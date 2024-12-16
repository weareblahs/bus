const csvFilePath = "./stop_times.csv";
import csv from "csvtojson";
import { writeFile } from "fs";
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    writeFile("./stop_times.json", JSON.stringify(jsonObj), () => {
      return "Success";
    });
  });
