import { getGtfsData, type GTFSData } from "@/lib/getGtfsData";
import type { RelatedRoutes, Routes, Stations } from "@/lib/publicJsonTypes";
import { useVars } from "@/lib/state";
import {
  retrieveRelatedRoutes,
  retrieveRoutes,
  retrieveStationList,
} from "@/lib/utils";
import type { transit_realtime } from "gtfs-realtime-bindings";
import { useEffect, useRef, useState } from "react";

export function Home() {
  const providerName = useVars((state) => state.providerName);
  const [gtfs, setGtfs] = useState<transit_realtime.FeedMessage | null>(null);
  const [relRoute, setRelRoute] = useState<RelatedRoutes | null>(null);
  const [stations, setRelStn] = useState<Stations | null>(null);
  const [route, setRoute] = useState<Routes | null>(null);
  const pid = useVars((state) => state.id);
  useEffect(() => {
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
    loadData();
  }, []);

  console.log(gtfs);
  console.log(relRoute);
  return (
    <div className="p-5">
      <h1>{providerName}</h1>
      <div>
        {gtfs?.entity.map((e) => {
          const parsedRouteId = Object.entries(relRoute ?? {}).find(
            ([, values]) => values.includes(e.vehicle?.trip?.tripId || ""),
          )?.[0];

          const routeData = route?.filter((r) => r.routeId === parsedRouteId);

          return (
            <p key={e.vehicle?.vehicle?.id}>
              {e.vehicle?.vehicle?.id} (tid: {e.vehicle?.trip?.tripId}, parsed
              route id: {parsedRouteId}, route name:{" "}
              {routeData?.[0]?.routeShortName} ({routeData?.[0]?.routeName}))
            </p>
          );
        })}
      </div>
    </div>
  );
}
