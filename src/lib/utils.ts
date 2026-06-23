import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  RelatedRoutes,
  Routes,
  StationNav,
  Stations,
} from "./publicJsonTypes";
import ky from "ky";
import haversine from "haversine-distance";
import { ORS } from "@routingjs/ors";

// ORS is used in multiple functions
const apiKey = import.meta.env.VITE_ORS_API_KEY;
const ors = new ORS({
  apiKey: apiKey,
  baseUrl: "https://api.heigit.org/openrouteservice",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function retrieveRelatedRoutes(
  pid: string,
  alt: boolean,
): Promise<RelatedRoutes | null> {
  try {
    const fetch = await ky.get(
      `${window.location.href}/${pid}/relatedRoutes${alt ? "Alt" : ""}.json`,
    );
    const resp = (await fetch.json()) as RelatedRoutes;
    return resp;
  } catch (e) {
    return null;
  }
}

export async function retrieveStationList(
  pid: string,
): Promise<Stations | null> {
  try {
    const fetch = await ky.get(`${window.location.href}/${pid}/stations.json`);
    const resp = (await fetch.json()) as Stations;
    return resp;
  } catch (e) {
    return null;
  }
}

export async function retrieveRoutes(pid: string): Promise<Routes | null> {
  try {
    const fetch = await ky.get(`${window.location.href}/${pid}/routes.json`);
    const resp = (await fetch.json()) as Routes;
    return resp;
  } catch (e) {
    return null;
  }
}

export async function findNearestFromStations(
  lat: number,
  lon: number,
  stnList: Stations,
  availStn: string[],
): Promise<StationNav | null> {
  const stationList = stnList.filter((s) => availStn.includes(s.id)); // station list including lat/lon for comparision
  if (stationList.length !== 0) {
    const avgDistList: number[] = [];
    stationList.forEach((s) => {
      const avgDist = haversine({ lat, lon }, { lat: s.lat, lon: s.lon });
      avgDistList.push(avgDist);
    });
    const sortedDistList = avgDistList.toSorted((a, b) => a - b);

    const prev =
      stationList[avgDistList.indexOf(sortedDistList[0]) - 1] ?? null;
    const cur = stationList[avgDistList.indexOf(sortedDistList[0])]; // since both avgDistList and stationList has the same arrangement this is used
    const next = stationList[avgDistList.indexOf(sortedDistList[0]) + 1];

    try {
      const osrmDist = await getOSRMDistance(lat, lon, cur.lat, cur.lon);
      const geocodeResponse = await getORSgeocode(lat, lon);

      return {
        prev,
        cur,
        next,
        dist: osrmDist?.distance ?? null,
        dur: osrmDist?.duration ?? null,
        geo:
          geocodeResponse &&
          geocodeResponse.features &&
          geocodeResponse.features.length > 0
            ? geocodeResponse.features[0].properties
            : [],
      };
    } catch (e) {
      console.log("OSRM error: ", e);
      return {
        prev,
        cur,
        next,
        dist: null,
        dur: null,
        geo: [],
      };
    }
  }
  return null;
}

export async function getOSRMDistance(
  p1lat: number | undefined,
  p1lon: number | undefined,
  p2lat: number | undefined,
  p2lon: number | undefined,
) {
  if (p1lat && p1lon && p2lat && p2lon) {
    const dir = await ors.directions(
      [
        [p1lat, p1lon],
        [p2lat, p2lon],
      ],
      "driving-car",
    );
    return dir.directions[0].feature?.properties;
  } else {
    throw Error("One of the values are not specified");
  }
}

export async function getORSgeocode(
  lat: number | undefined,
  lon: number | undefined,
): Promise<any> {
  try {
    // size and boundary.country are set accordingly to use case of bus?
    // size=1 > return exactly 1 result
    // boundary.country value limits to malaysia only
    const resp = ky.get(
      `https://api.heigit.org/pelias/v1/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lon}&size=1&boundary.country=MY`,
    );
    return resp.json();
  } catch (e) {
    throw Error("Geocode Retrieval Failure");
  }
}
