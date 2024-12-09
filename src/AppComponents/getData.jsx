import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import trips from "../privData/rapidPenang_trips.json";
export const getData = async (route) => {
  let foundTrips = [];
  try {
    const response = await fetch(
      "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-penang"
    );
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
      error.response = response;
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
