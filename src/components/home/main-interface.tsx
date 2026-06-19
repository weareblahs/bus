import { getGtfsData, type GTFSData } from "@/lib/getGtfsData";
import { useVars } from "@/lib/state";
import {
  findNearestFromStations,
  retrieveRelatedRoutes,
  retrieveRoutes,
  retrieveStationList,
} from "@/lib/utils";
import { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { SingleDataCard } from "./single-data-card";

export type DataCard = {
  vehicleId: string | undefined;
  tripId: string | undefined;
  parsedRouteId: string | undefined;
  routeName: string | undefined;
  routeShortName: string | undefined;
  speed: number | -1;
  nav: Awaited<ReturnType<typeof findNearestFromStations>>;
};

export function BqmMainInterface() {
  const providerName = useVars((state) => state.providerName);
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

  async function loadData(routeNo: string | undefined): Promise<DataCard[]> {
    if (routeNo) {
      const data: GTFSData = await getGtfsData();
      const relTripId = rr?.[routeNo ?? ""];
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
            parsedRouteId: routeNo,
            routeName: routeData?.routeName,
            routeShortName: routeData?.routeShortName,
            nav: nav ?? null,
            speed: e.vehicle?.position?.speed ?? -1,
          };
        }),
      );
      return rows;
    }

    return [];
  }

  const { data, isPending, error, refetch, isRefetching } = useQuery({
    queryKey: [selected],
    queryFn: () => loadData(selected),
  });

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-5">
      <div className="mb-3 mx-3">
        <div className="grid grid-cols-12">
          <div className="cols col-span-9">{providerName}</div>
        </div>
        {/* dropdown for choosing route */}
        <div className="w-full">
          <Select
            value={selected}
            onValueChange={(v: string) => {
              setSelected(v);
              refetch();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a bus route..." />
            </SelectTrigger>
            <SelectContent className="w-full">
              {rte
                ?.sort((a, b) => a.routeName.localeCompare(b.routeName))
                .map((r) => {
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

      {/* datacard display */}
      <div>
        {isPending ||
          (isRefetching && (
            <center>
              <div className="block w-full lg:w-[60%]">
                <h1 className="text-2xl">Loading route information...</h1>
                <h3 className="text-xl">
                  This might take a while according to how many buses are
                  operating under this route now.
                </h3>
              </div>
            </center>
          ))}

        {data &&
          data.length === 0 &&
          !isPending &&
          !isRefetching &&
          selected && (
            <>
              <center>
                <div className="block w-full lg:w-[60%]">
                  <h1 className="text-2xl">
                    No realtime information available for this route
                  </h1>
                  <h3 className="text-xl">
                    Please search for other routes or try again later.
                  </h3>
                </div>
              </center>
            </>
          )}

        {/* DATA FOUND: display data card */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mx-3">
          {data &&
            !isPending &&
            !isRefetching &&
            data.length !== 0 &&
            data.map((b) => <SingleDataCard key={b.vehicleId} data={b} />)}
        </div>
      </div>
    </div>
  );
}
