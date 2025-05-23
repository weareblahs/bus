import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import providers from "../internalData/providers.json";
import tripMainData from "../internalData/trips.json";
import Cookies from "js-cookie";
import ky from "ky";

export const geocoding = async (lat, lon) => {
  const language = JSON.parse(Cookies.get("geoLanguage"))[0];
  try {
    let headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "bus? v2 (https://b.ntyx.dev)/Geolocation",
      "Accept-Language": language,
    });
    const res = await ky
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&countrycodes=MY`,
        {
          headers,
        }
      )
      .json();

    // localization. chinese usually uses a format with state-city-road. technically an observation on amap i made during my china trip last year
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
          // NOTE TO SELF: all other stuff that isn't from this foreach loop MUST be executed on the DataDisplay component
          // no matter what. that incident almost made me go back to the previous commit
          exportData.push({
            route: route,
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

    return {
      nextDeparture: firstStopTimeObject,
      stations: final,
    };
  }
  // return {};
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2022            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

export const getNearbyStation = async (route, lat, long) => {
  // known stuff: get provider
  const provider = Cookies.get("provider");
  // get route station info, including lat and long
  const stationInfo = await ky
    .get(
      `${window.location.protocol}//${window.location.host}/data/stnInfo/${provider}_${route}.json`
    )
    .json();
  let data = [];
  const position = route.charAt(route.length - 1);
  stationInfo.forEach((s) => {
    // const total = parseFloat(s.stop_lat) + parseFloat(s.stop_lon);
    // based on route position, use appropriate calculation methods
    // s.stop_lat >= parseFloat(lat) && s.stop_lon <= parseFloat(long)
    // distance(lat, long, s.stop_lat, s.stop_lon, "K") <= 0.1

    if (distance(lat, long, s.stop_lat, s.stop_lon, "K") <= 0.5) {
      data.push({
        name: s.stop_name,
        lat: parseFloat(s.stop_lat),
        long: parseFloat(s.stop_lon),
        seq: parseFloat(s.stop_sequence),
      });
    }
  });
  return data;
};

export const osrm = async (lat1, lon1, lat2, lon2) => {
  try {
    const data = await ky.get(
      `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`
    );
    const json = await data.json();
    return [json["routes"][0]["distance"], json["routes"][0]["duration"]];
  } catch (e) {
    return {};
  }
};

export const getStationNames = async (route, seq) => {
  const provider = Cookies.get("provider");
  const stopURL = `${window.location.protocol}//${window.location.host}/data/stnInfo/${provider}_${route}.json`;
  const stopRes = await ky.get(stopURL);
  if (stopRes) {
    console.log(seq);
    if (stopRes.json().length != 0) {
      return [
        stopRes[0]["stop_sequence"] == seq
          ? "Start of route"
          : stopRes.json()[seq - 2]["stop_name"],
        stopRes.json()[seq - 1]["stop_name"],
        stopRes.length == seq
          ? "End of route"
          : stopRes.json()[seq]["stop_name"],
      ];
    }
    return ["Unknown station", "Unknown station", "Unknown station"]; // fallback - returns "Unknown station" when no station is found
  }
};
