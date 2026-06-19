import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import type { DataCard } from "./main-interface";

export function SingleDataCard({ data }: { data: DataCard }) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-4 mb-3">
          <div className="cols col-span-3">{data.vehicleId}</div>
          <div className="cols col-span-1 ms-auto">
            {data.speed !== -1 && (
              <Badge
                className={(cn(data.speed > 5 && "bg-green-500"), "rounded-sm")}
              >
                {Math.round(data.speed * 100) / 100}km/h
              </Badge>
            )}
          </div>
        </div>

        {/* prev / cur / next */}
        <div className="text-center">
          <div className="text-lg">
            <p>{data.nav?.prev ? data.nav?.prev.name : "First station"}</p>
          </div>

          <div className="text-3xl bg-blue-600 rounded-2xl py-3 my-2">
            <p className="w-[95%] ms-auto me-auto">{data.nav?.cur?.name}</p>
            <p className="text-base">
              {data.nav?.dist &&
                data.nav.dur &&
                `${(data.nav.dist / 1000).toFixed(2)}km (${
                  Math.round(data.nav.dur / 60) === 0
                    ? "<1 minute"
                    : `${Math.round(data.nav.dur / 60)} minute${
                        Math.round(data.nav.dur / 60) > 1 ? "s" : ""
                      }`
                }) left to destination`}
            </p>
          </div>

          <div className="text-lg">
            <p>{data.nav?.next ? data.nav?.next.name : "Last station"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
