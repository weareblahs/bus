import { getGtfsData, type GTFSData } from "@/lib/getGtfsData";
import type { RelatedRoutes, Routes, Stations } from "@/lib/publicJsonTypes";
import { useVars } from "@/lib/state";
import {
  findNearestFromStations,
  retrieveRelatedRoutes,
  retrieveRoutes,
  retrieveStationList,
} from "@/lib/utils";
import type { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function DebugLabs() {
  const providerName = useVars((state) => state.providerName);
  const [gtfs, setGtfs] = useState<transit_realtime.FeedMessage | null>(null);
  const [relRoute, setRelRoute] = useState<RelatedRoutes | null>(null);
  const [stations, setRelStn] = useState<Stations | null>(null);
  const [route, setRoute] = useState<Routes | null>(null);
  const pid = useVars((state) => state.id);

  const loadData = async () => {
    const data: GTFSData = await getGtfsData();
    setGtfs(data);

    const rr = await retrieveRelatedRoutes(pid, false);
    setRelRoute(rr);

    const stn = await retrieveStationList(pid);
    setRelStn(stn);

    const rte = await retrieveRoutes(pid);
    setRoute(rte);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-5">
      <div className="mb-3 mx-3">
        <div className="grid grid-cols-12">
          <div className="cols col-span-9">
            <h1 className="text-3xl">Debug Labs&trade;</h1>
            <h3 className="text-xl">
              The part where everything goes "test mode" and never shows up in
              front of a regular use of bus?
            </h3>
            <h3 className="text-base">
              <i>
                Current selected provider: <b>{providerName}</b>{" "}
              </i>
            </h3>
          </div>
          <div className="ms-auto cols col-span-3">
            <Button onClick={loadData}>Refresh</Button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {gtfs?.entity.map((e) => {
            const parsedRouteId = Object.entries(relRoute ?? {}).find(
              ([, values]) => values.includes(e.vehicle?.trip?.tripId || ""),
            )?.[0];

            const routeData = route?.find((r) => r.routeId === parsedRouteId);

            // distance search
            const nav = findNearestFromStations(
              e.vehicle?.position?.latitude ?? 0,
              e.vehicle?.position?.longitude ?? 0,
              stations ?? [],
              routeData?.routeStations ?? [],
            );

            return (
              <Card key={e.id ?? e.vehicle?.vehicle?.id}>
                <CardHeader>
                  <CardTitle className="text-3xl">
                    {e.vehicle?.vehicle?.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Trip ID: {e.vehicle?.trip?.tripId}
                  <br />
                  Parsed route ID: {parsedRouteId}
                  <br />
                  Route number: {routeData?.routeName}
                  <br />
                  Route name:{" "}
                  <span className="text-ellipsis">
                    {routeData?.routeShortName}
                  </span>
                  <br />
                  <br />
                  Estimated Previous/Current/Next station (not calculated by
                  ORS/OSRM)
                  <br />
                  Previous: {nav?.prev?.name ?? "Possible first station"} (
                  {nav?.prev?.id ?? "-"})
                  <br />
                  Current: {nav?.cur?.name ?? "-"} ({nav?.cur?.id ?? "-"})
                  <br />
                  Next: {nav?.next?.name ?? "Possible last station"} (
                  {nav?.next?.id ?? "-"})
                  <br />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
