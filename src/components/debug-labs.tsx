import { getGtfsData, type GTFSData } from "@/lib/getGtfsData";
import { useVars } from "@/lib/state";
import {
  findNearestFromStations,
  retrieveRelatedRoutes,
  retrieveRoutes,
  retrieveStationList,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

type DataCard = {
  vehicleId: string | undefined;
  tripId: string | undefined;
  parsedRouteId: string | undefined;
  routeName: string | undefined;
  routeShortName: string | undefined;
  nav: Awaited<ReturnType<typeof findNearestFromStations>>;
};

export function DebugLabs() {
  const providerName = useVars((state) => state.providerName);
  const [buses, setAvailableBus] = useState<DataCard[]>([]);
  const pid = useVars((state) => state.id);
  const setDebug = useVars((state) => state.setDebugLabs);
  const loadData = async () => {
    const data: GTFSData = await getGtfsData();
    // get related routes
    const rr = await retrieveRelatedRoutes(pid, false);
    // get list of available stations of provider
    const stn = await retrieveStationList(pid);
    // get list of routes
    const rte = await retrieveRoutes(pid);

    const rows = await Promise.all(
      // get GTFS realtime data from protobuf filtered by Trip IDs
      data.entity.map(async (e) => {
        const parsedRouteId = Object.entries(rr ?? {}).find(([, values]) =>
          values.includes(e.vehicle?.trip?.tripId || ""),
        )?.[0];

        //
        const routeData = rte?.find((r) => r.routeId === parsedRouteId);

        const nav = await findNearestFromStations(
          e.vehicle?.position?.latitude ?? 0,
          e.vehicle?.position?.longitude ?? 0,
          stn ?? [],
          routeData?.routeStations ?? [],
        );

        return {
          vehicleId: e.vehicle?.vehicle?.id ?? undefined,
          tripId: e.vehicle?.trip?.tripId ?? undefined,
          parsedRouteId,
          routeName: routeData?.routeName,
          routeShortName: routeData?.routeShortName,
          nav,
        };
      }),
    );

    setAvailableBus(rows);
  };

  console.log(buses);

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
            <Button onClick={setDebug}>Back to bus?</Button>
          </div>
          <div className="ms-auto cols col-span-3">
            <Button onClick={loadData}>Refresh</Button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {buses.map((b) => (
            <Card key={b.vehicleId}>
              <CardHeader>
                <CardTitle className="text-3xl">{b.vehicleId}</CardTitle>
              </CardHeader>
              <CardContent>
                Trip ID: {b.tripId}
                <br />
                Parsed route ID: {b.parsedRouteId}
                <br />
                Route number: {b.routeName}
                <br />
                Route name:{" "}
                <span className="text-ellipsis">{b.routeShortName}</span>
                <br />
                <br />
                Estimated Previous/Current/Next station (not calculated by
                ORS/OSRM)
                <br />
                Previous: {b.nav?.prev?.name ?? "Possible first station"} (
                {b.nav?.prev?.id ?? "-"})
                <br />
                Current: {b.nav?.cur?.name ?? "-"} ({b.nav?.cur?.id ?? "-"})
                <br />
                Next: {b.nav?.next?.name ?? "Possible last station"} (
                {b.nav?.next?.id ?? "-"})
                <br />
                <br />
                Current station distance (OSRM): {b.nav?.dist}m
                <br />
                Current station duration (OSRM): {b.nav?.dur}s
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
