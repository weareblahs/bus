import GtfsRealtimeBindings from "gtfs-realtime-bindings";

import tripMainData from "../privData/trips.json";
import axios from "axios";
import Cookies from "js-cookie";
export const getData = async (route) => {
  let foundTrips = [];
  const tripProvider = Cookies.get("provider");
  var trips = tripMainData.filter(
    (t) => t.providerName == Cookies.get("provider")
  )[0]["trips"];
  try {
    const response = await fetch(Cookies.get("endpoint"));
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );

      error.response = response;
      return [
        {
          status:
            "It seems that you've been searching too fast. Try re-selecting this station in a few seconds.",
        },
      ];
      throw error;
      process.exit(1);
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    const foundTripIds = trips
      .filter((t) => t.name === route)
      .map(({ id }) => ({ trip_id: id }));
    foundTripIds.forEach((t) => {
      const trip = feed.entity.filter(
        (f) => f.vehicle.trip.tripId === t.trip_id
      );
      if (trip.length !== 0) {
        foundTrips.push(trip);
      }
    });
  } catch (error) {
    process.exit(1);
  }

  return JSON.stringify(foundTrips);
};

export const getStaticTrips = async (route) => {
  const state = Cookies.get("state");
  const provider = Cookies.get("provider");
  const parsedTrips = tripMainData;
  const url = `${window.location.protocol}//${window.location.host}/data/${provider}_static_time_data.json`;
  const stopURL = `${window.location.protocol}//${window.location.host}/data/stnInfo/${provider}_${route}.json`;
  const routeArray = parsedTrips
    .filter((t) => t.providerName == provider)[0]
    ["trips"].filter((t) => t.name == route);

  const staticData = await axios.get(url);
  const stopData = await axios.get(stopURL);
  let na = [];
  routeArray.forEach((r) => {
    na.push(staticData.data.filter((d) => d.id == r.id));
  });
  // each array consists of stations
  const currentTime = new Date().toLocaleTimeString();
  var now = new Date();
  var pretty = [
    now.getHours(),
    ":",
    now.getMinutes(),
    ":",
    now.getSeconds(),
  ].join("");

  const seconds = (time) => {
    var a = time.split(":");
    var finalResult = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return finalResult;
  };
  var current = seconds(pretty);
  let na2 = [];
  na.forEach((n) => {
    n.forEach((n2) => na2.push(n2));
  });

  let na3 = [];
  na2
    .sort((a, b) => seconds(a.time) - seconds(b.time))
    .forEach((s, index) => {
      if (na2[index]?.time == na2[index - 1]?.time) {
      } else {
        na3.push(s);
      }
    });
  const sortedTime = na3.filter((a) => seconds(a.time) > seconds(pretty));

  if (na3 != [] || na3.length !== 0) {
    let final = [];

    if (sortedTime.length == 0) return sortedTime;
    var i;
    for (i = 0; i < sortedTime.length; i++) {
      const relatedStopData = stopData?.data?.filter(
        (s) => s.stop_id == sortedTime[i].stop
      );
      if (sortedTime != [] || sortedTime.length != []) {
        final.push({
          time: sortedTime[i].time,
          relatedStopData: relatedStopData,
        });
      }
    }
    return final;
  }
};
