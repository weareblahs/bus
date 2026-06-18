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
import {
  type RelatedRoutes,
  type Stations,
  type Routes,
} from "@/lib/publicJsonTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

type DataCard = {
  vehicleId: string | undefined;
  tripId: string | undefined;
  parsedRouteId: string | undefined;
  routeName: string | undefined;
  routeShortName: string | undefined;
  nav: Awaited<ReturnType<typeof findNearestFromStations>>;
};

export function BqmMainInterface() {
  const providerName = useVars((state) => state.providerName);
  const [buses, setAvailableBus] = useState<DataCard[]>([]);
  const [rr, setRelatedRoutes] = useState<RelatedRoutes | null>();
  const [stn, setListOfStations] = useState<Stations | null>([]);
  const [rte, setRoutes] = useState<Routes | null>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const pid = useVars((state) => state.id);

  // initialization - download required static JSON files from API
  const init = async () => {
    // get related routes
    const relRoutes = await retrieveRelatedRoutes(pid, false);
    setRelatedRoutes(relRoutes);
    // get list of available stations of provider
    const stnList = await retrieveStationList(pid);
    setListOfStations(stnList);
    // get list of routes
    const routes = await retrieveRoutes(pid);
    setRoutes(routes);
  };

  const loadData = async () => {
    const data: GTFSData = await getGtfsData();
    console.log(data);
    const relTripId = rr?.[selected ?? ""];
    const filteredGTFSdata = data.entity.filter((d) =>
      relTripId?.includes(d.vehicle?.trip?.tripId || ""),
    );
    const rows = await Promise.all(
      // get GTFS realtime data from protobuf filtered by Trip IDs
      // filter by trip ID?

      filteredGTFSdata.map(async (e) => {
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
          parsedRouteId: selected,
          routeName: routeData?.routeName,
          routeShortName: routeData?.routeShortName,
          nav: nav ?? null,
        };
      }),
    );

    setAvailableBus(rows);
  };

  console.log(buses);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    loadData();
  }, [selected]);

  return (
    <div className="p-5">
      <div className="mb-3 mx-3">
        <div className="grid grid-cols-12">
          <div className="cols col-span-9">{providerName}</div>
        </div>
        {/* dropdown for choosing route */}
        <div className="w-full">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a bus route..." />
            </SelectTrigger>
            <SelectContent className="w-full">
              {rte?.map((r) => {
                return (
                  <SelectItem value={r.routeId}>
                    <div className="flex">
                      <Badge
                        style={{
                          color: `#${r.routeTextColor}`,
                          backgroundColor: `#${r.routeColor}`,
                        }}
                        className="rounded-sm me-3 mt-auto mb-auto"
                      >
                        {r.routeName}
                      </Badge>
                      <span>{r.routeShortName}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {buses &&
            buses.map((b) => (
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
