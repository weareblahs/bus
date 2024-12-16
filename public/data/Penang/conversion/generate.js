import fs from "fs";

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const routes = loadJSON("./routes.json");
//

const trips = loadJSON("./trips.json");
console.log(trips.filter((t) => t.route_id === "30000041"));
