import fs from "fs";
const providerNames = ["penang", "kl", "kuantan"];
let finalFile = [];

providerNames.forEach((f) => {
  const trips = JSON.parse(
    fs.readFileSync(`./${f}/trips.json`, "utf-8", () => {
      return "Success";
    })
  );
  const routes = JSON.parse(
    fs.readFileSync(`./${f}/routes.json`, "utf-8", () => {
      return "Success";
    })
  );
  let outFile = [];
  trips.forEach((t) => {
    outFile.push({
      id: t.trip_id,
      name: `${
        routes.filter((r) => r.route_id === t.route_id)[0]["route_short_name"]
      }${t.direction_id == 0 ? "A" : "B"}`,
    });
  });
  let providerName = "";
  if (f == "penang") {
    providerName = "rapidPenang";
  }
  if (f == "kl") {
    providerName = "rapidKL";
  }
  if (f == "kuantan") {
    providerName = "rapidKuantan";
  }

  finalFile.push({
    providerName,
    trips: outFile,
  });
});

fs.writeFile("./trips_generated.json", JSON.stringify(finalFile), () => {
  return "Write successful";
});
