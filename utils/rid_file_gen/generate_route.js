import fs from "fs";

const trips = JSON.parse(
  fs.readFileSync("./trips.json", "utf-8", () => {
    return "Success";
  })
);
const routes = JSON.parse(
  fs.readFileSync("./routes.json", "utf-8", () => {
    return "Success";
  })
);
let outFile = [];
trips.forEach((t) => {
  const data = {
    id: `${
      routes.filter((r) => r.route_id === t.route_id)[0]["route_short_name"]
    }${t.direction_id == 0 ? "A" : "B"}`,
    name: `${
      routes.filter((r) => r.route_id === t.route_id)[0]["route_long_name"]
    }`,
  };
  if (outFile[outFile.length - 2] != data) {
    outFile.push(data);
  }
  // outFile.push();
});
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
const of1 = outFile.filter(
  (value, index, self) =>
    index === self.findIndex((t) => t.id === value.id && t.name === value.name)
);

fs.writeFile("./routes_1.json", JSON.stringify(of1), () => {
  return "Write successful";
});
