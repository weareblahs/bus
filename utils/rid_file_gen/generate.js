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
  outFile.push({
    id: t.trip_id,
    name: `${routes.filter((r) => r.id === t.route_id)[0]["name"]}${
      t.direction_id == 0 ? "A" : "B"
    }`,
  });
});

fs.writeFile("./trips.json", JSON.stringify(outFile), () => {
  return "Write successful";
});
