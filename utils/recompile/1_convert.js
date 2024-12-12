const csvFilePath = "./routes.csv";
import csv from "csvtojson";
import { writeFile } from "fs";
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    writeFile("./routes.json", JSON.stringify(jsonObj), () => {
      return "Success";
    });
  });
