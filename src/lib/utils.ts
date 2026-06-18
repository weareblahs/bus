import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RelatedRoutes, Routes, Stations } from "./publicJsonTypes";
import ky from "ky";

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
) {}
