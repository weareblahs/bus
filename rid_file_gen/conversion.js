const csvFilePath = "./trips.csv";
import csv from "csvtojson";
import { writeFile } from "fs";
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    writeFile("./trips.json", JSON.stringify(jsonObj), () => {
      return "Success";
    });
  });
