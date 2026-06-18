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

export function findNearestFromStations(
  lat: number,
  lon: number,
  stnList: Stations,
  availStn: number[],
): StationNav | null {
  const stationList = stnList.filter((s) => availStn.includes(s.id)); // station list including lat/lon for comparision
  if (stationList.length !== 0) {
    const avgDistList: number[] = [];
    stationList.forEach((s) => {
      const avgDist = haversine({ lat, lon }, { lat: s.lat, lon: s.lon });
      avgDistList.push(avgDist);
    });
    const sortedDistList = avgDistList.toSorted((a, b) => a - b);
    return {
      prev: stationList[avgDistList.indexOf(sortedDistList[0]) - 1] ?? null,
      cur: stationList[avgDistList.indexOf(sortedDistList[0])], // since both avgDistList and stationList has the same arrangement this is used
      next: stationList[avgDistList.indexOf(sortedDistList[0]) + 1] ?? null,
    };
  }
  return null;
}
