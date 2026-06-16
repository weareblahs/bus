const providerNames = ["penang", "kl", "kuantan"];
import csv from "csvtojson";
import { writeFile } from "fs";
// temporary solution

{
  const fnt0 = `./penang/trips.txt`;
  const fnt1 = `./penang/trips.json`;
  const fnr0 = `./penang/routes.txt`;
  const fnr1 = `./penang/routes.json`;
  csv()
    .fromFile(fnt0)
    .then((jsonObj) => {
      writeFile(fnt1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });

  csv()
    .fromFile(fnr0)
    .then((jsonObj) => {
      writeFile(fnr1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });
}

{
  const fnt0 = `./kl/trips.txt`;
  const fnt1 = `./kl/trips.json`;
  const fnr0 = `./kl/routes.txt`;
  const fnr1 = `./kl/routes.json`;
  csv()
    .fromFile(fnt0)
    .then((jsonObj) => {
      writeFile(fnt1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });

  csv()
    .fromFile(fnr0)
    .then((jsonObj) => {
      writeFile(fnr1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });
}

{
  const fnt0 = `./kuantan/trips.txt`;
  const fnt1 = `./kuantan/trips.json`;
  const fnr0 = `./kuantan/routes.txt`;
  const fnr1 = `./kuantan/routes.json`;
  csv()
    .fromFile(fnt0)
    .then((jsonObj) => {
      writeFile(fnt1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });

  csv()
    .fromFile(fnr0)
    .then((jsonObj) => {
      writeFile(fnr1, JSON.stringify(jsonObj), () => {
        return "Success";
      });
    });
}
