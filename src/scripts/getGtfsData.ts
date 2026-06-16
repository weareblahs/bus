import ky, { HTTPError } from "ky";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { gtfsDataUrl } from "./variables";

export type GTFSData = GtfsRealtimeBindings.transit_realtime.FeedMessage;
export async function getGtfsData(): Promise<GTFSData> {
  try {
    const response = await ky.get(gtfsDataUrl);
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer),
    );
    feed.entity.forEach((entity: any) => {
      if (entity.tripUpdate) {
        console.log(entity.tripUpdate);
      }
    });
    return feed;
  } catch (e) {
    if (e instanceof HTTPError && e.response.status == 429) {
      // most GTFS data error from data.gov.my are
      // mostly 429 (ratelimit). if blank data is
      // retrieved it will only return a blank GTFS-R
      // protobuf
      //
      // if over 4 requests/minute it will return a ratelimit
      // msg with Retry-After header so it will be parsed through
      // there
      //
      // TODO: fix rate limit retry seconds
      const rateLimitRetrySec = e.response.headers.get("Retry-After");
      throw new Error(
        `data.gov.my Ratelimit reachecd - expect to retry after ${rateLimitRetrySec} seconds`,
      );
    }
    throw e; // throw other error types
  }
}
