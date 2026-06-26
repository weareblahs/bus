import type { Station } from "@/lib/publicJsonTypes";
import type { DataCard } from "./main-interface";
import { Card, CardContent } from "./card";
import { useEffect, useState } from "react";
import { getOSRMDistance } from "@/lib/utils";

export function TimeLeftDataCard({
  singleStnProp,
  dataCardProp,
  listOfStn,
}: {
  singleStnProp: Station | undefined;
  dataCardProp: DataCard;
  listOfStn: string[] | undefined;
}) {
  if (singleStnProp && listOfStn) {
    const [dur, setDur] = useState<number | null>();
    const lat = singleStnProp.lat;
    const lon = singleStnProp.lon;
    const currentIdx = listOfStn.indexOf(dataCardProp.nav?.cur.id ?? "");
    const selectedIdx = listOfStn.indexOf(singleStnProp.id);
    const diff = selectedIdx - currentIdx;
    useEffect(() => {
      async function get() {
        const resp = await getOSRMDistance(
          dataCardProp.lat,
          dataCardProp.lon,
          lat,
          lon,
        );
        if (resp) {
          setDur(resp.duration);
        }
      }
      get();
    }, [
      dataCardProp.lat,
      dataCardProp.lon,
      singleStnProp?.lat,
      singleStnProp?.lon,
      listOfStn,
    ]);
    return (
      diff >= 0 && (
        <Card>
          <CardContent>
            <div className="grid grid-cols-8">
              <div className="grid cols col-span-6 my-auto">
                <h3 className="text-2xl font-bold">{dataCardProp.vehicleId}</h3>
              </div>
              <div className="grid cols col-span-2 ms-auto text-end">
                <div>
                  {dur && (
                    <h3 className="text-2xl font-bold ">
                      {dur / 60 < 1 ? "<1" : Math.round(dur / 60)} min
                      {dur / 60 >= 2 ? "s" : ""}
                    </h3>
                  )}
                </div>
                <div>
                  {diff && diff > 0
                    ? `${diff} station${diff > 1 ? "s" : ""} left`
                    : "Arriving soon"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    );
    return <></>;
  }
}
