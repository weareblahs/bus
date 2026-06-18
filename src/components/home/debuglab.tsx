import { getGtfsData, type GTFSData } from "@/lib/getGtfsData";
import { useVars } from "@/lib/state";
import {
  findNearestFromStations,
  retrieveRelatedRoutes,
  retrieveRoutes,
  retrieveStationList,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

type DebugRow = {
  vehicleId: string | undefined;
  tripId: string | undefined;
  parsedRouteId: string | undefined;
  routeName: string | undefined;
  routeShortName: string | undefined;
  nav: Awaited<ReturnType<typeof findNearestFromStations>>;
};

export function DebugLabs() {
  const providerName = useVars((state) => state.providerName);
  const [debugRows, setDebugRows] = useState<DebugRow[]>([]);
  const pid = useVars((state) => state.id);

  const loadData = async () => {
    const data: GTFSData = await getGtfsData();
    const rr = await retrieveRelatedRoutes(pid, false);
    const stn = await retrieveStationList(pid);
    const rte = await retrieveRoutes(pid);
    const rows = await Promise.all(
      data.entity.slice(0, 5).map(async (e) => {
        const parsedRouteId = Object.entries(rr ?? {}).find(([, values]) =>
          values.includes(e.vehicle?.trip?.tripId || ""),
        )?.[0];

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

    setDebugRows(rows);
  };

  console.log(debugRows);

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
          {debugRows.map((row) => (
            <Card key={row.vehicleId}>
              <CardHeader>
                <CardTitle className="text-3xl">{row.vehicleId}</CardTitle>
              </CardHeader>
              <CardContent>
                Trip ID: {row.tripId}
                <br />
                Parsed route ID: {row.parsedRouteId}
                <br />
                Route number: {row.routeName}
                <br />
                Route name:{" "}
                <span className="text-ellipsis">{row.routeShortName}</span>
                <br />
                <br />
                Estimated Previous/Current/Next station (not calculated by
                ORS/OSRM)
                <br />
                Previous: {row.nav?.prev?.name ?? "Possible first station"} (
                {row.nav?.prev?.id ?? "-"})
                <br />
                Current: {row.nav?.cur?.name ?? "-"} ({row.nav?.cur?.id ?? "-"})
                <br />
                Next: {row.nav?.next?.name ?? "Possible last station"} (
                {row.nav?.next?.id ?? "-"})
                <br />
                <br />
                Current station distance (OSRM): {row.nav?.dist}m
                <br />
                Current station duration (OSRM): {row.nav?.dur}s
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
