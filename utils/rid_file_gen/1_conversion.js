const csvFilePath = "./trips.txt";
const csvFilePath2 = "./routes.txt";
import csv from "csvtojson";
import { writeFile } from "fs";
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    writeFile("./trips.json", JSON.stringify(jsonObj), () => {
      return "Success";
    });
  });
csv()
  .fromFile(csvFilePath2)
  .then((jsonObj) => {
    writeFile("./routes.json", JSON.stringify(jsonObj), () => {
      return "Success";
    });
  });

