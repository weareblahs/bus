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

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export type Stations = Station[];

export type RelatedRoutes = {
  [routeId: string]: string[];
};

// StationNav is used for storing previous/current/next station
export type StationNav = {
  prev: Station | null;
  cur: Station;
  next: Station | null;
  dist: number | null;
  dur: number | null;
  geo: any;
};
