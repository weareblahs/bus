import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import Cookies from "js-cookie";
import tripMainData from "../privData/trips.json";
export const getData = async (route) => {
  let foundTrips = [];
  const tripProvider = Cookies.get("provider");
  var trips = tripMainData.filter(
    (t) => t.providerName == Cookies.get("provider")
  )[0]["trips"];
  try {
    const response = await fetch(Cookies.get("endpoint"));
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );

      error.response = response;
      return [
        {
          status:
            "It seems that you've been searching too fast. Try re-selecting this station in a few seconds.",
        },
      ];
      throw error;
      process.exit(1);
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    const foundTripIds = trips
      .filter((t) => t.name === route)
      .map(({ id }) => ({ trip_id: id }));
    foundTripIds.forEach((t) => {
      const trip = feed.entity.filter(
        (f) => f.vehicle.trip.tripId === t.trip_id
      );
      if (trip.length !== 0) {
        foundTrips.push(trip);
      }
    });
  } catch (error) {
    process.exit(1);
  }
  return JSON.stringify(foundTrips);
};
