import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import trips from "../privData/rapidPenang_trips.json";
import Cookies from "js-cookie";
export const getData = async (route) => {
  let foundTrips = [];
  try {
    const response = await fetch(Cookies.get("endpoint"));
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
      console.log(response);
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
      .filter((t) => t.route === route)
      .map(({ trip_id }) => ({ trip_id }));
    foundTripIds.forEach((t) => {
      const trip = feed.entity.filter(
        (f) => f.vehicle.trip.tripId === t.trip_id
      );
      if (trip.length !== 0) {
        foundTrips.push(trip);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  return JSON.stringify(foundTrips);
};
