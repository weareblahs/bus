export type Route = {
  routeId: string;
  routeName: string;
  routeShortName: string;
  routeColor: string;
  routeTextColor: string;
  routeStations: number[];
  routeStationsRev: number[];
};

export type Routes = Route[];

export type Station = { id: number; name: string; lat: number; lon: number };

export type Stations = Station[];

export type RelatedRoutes = {
  [routeId: string]: string[];
};
