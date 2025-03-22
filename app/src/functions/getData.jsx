import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import providers from "../internalData/providers.json";
import tripMainData from "../internalData/trips.json";
import Cookies from "js-cookie";
import ky from "ky";

export const geocoding = async (lat, lon) => {
  const language = JSON.parse(Cookies.get("geoLanguage"))[0];
  try {
    const res = await ky
      .extend({
        hooks: {
          beforeRequest: [
            (request) => {
              request.headers.set("Accept-Language", language);
            },
          ],
        },
      })
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&countrycodes=MY`
      )
      .json();
    console.log(res);
    // localization. chinese usually uses a format with state-city-road. technically an observation i made during my china trip last year
    if (language == "en" || language == "ms") {
      return `${res.address.road}, ${res.address.city}, ${res.address.state}`;
    } else if (language == "zh") {
      return `${res.address.state}${res.address.city}${res.address.road}`;
    }
  } catch (e) {
    return "";
  }
};

export const getData = async (route) => {
  const provider = Cookies.get("provider");
  const providerFilter = tripMainData
    .filter((p) => p.providerName == provider)[0]
    ["trips"].filter((r) => r.name == route);
  const endpoint = providers.filter((p) => p.providerName == provider)[0][
    "endpoint"
  ];
  //   let protobufData = ;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
      error.response = response;
      throw error;
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
    let exportData = [];

    feed.entity.forEach((f) => {
      providerFilter.forEach(async (p) => {
        if (p.id == f.vehicle.trip.tripId) {
          exportData.push({
            position_lat: f.vehicle.position.latitude,
            position_lon: f.vehicle.position.longitude,
            vehicle_speed: f.vehicle.position.speed,
            vehicle_plate: f.vehicle.vehicle.licensePlate,
            update_timestamp: f.vehicle.timestamp,
          });
        }
      });
    });
    return {
      data_available: true,
      data: exportData,
    };
  } catch (error) {
    return { data_available: false, data: error };
  }
};

export const getStaticTrips = async (route) => {
  const provider = Cookies.get("provider");
  const parsedTrips = tripMainData;
  const url = `${window.location.protocol}//${window.location.host}/data/${provider}_static_time_data.json`;
  const stopURL = `${window.location.protocol}//${window.location.host}/data/stnInfo/${provider}_${route}.json`;
  const routeArray = parsedTrips
    .filter((t) => t.providerName == provider)[0]
    ["trips"].filter((t) => t.name == route);
  const staticData = await ky.get(url).json();
  const stopData = await ky.get(stopURL).json();
  let na = [];
  routeArray.forEach((r) => {
    na.push(staticData.filter((d) => d.id == r.id));
  });
  // each array consists of stations
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
      const relatedStopData = stopData?.filter(
        (s) => s.stop_id == sortedTime[i].stop
      );
      if (sortedTime != [] || sortedTime.length != []) {
        final.push({
          time: sortedTime[i].time,
          relatedStopData: relatedStopData,
        });
      }
    }
    const stop_id = stopData?.[0]["stop_id"];
    // get next departure time from the first station of the route
    let firstStopTimeObject = {};
    if (sortedTime.length != 0) {
      firstStopTimeObject = {
        stop_id,
        stop_name: stopData?.[0]["stop_name"],
        first_stop_time: sortedTime.filter((s) => s.stop == stop_id)[0]["time"],
      };
    }
    console.log(firstStopTimeObject);
    return {
      nextDeparture: firstStopTimeObject,
      stations: final,
    };
  }
};
