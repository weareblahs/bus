import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { useVars } from "@/lib/state";

export function Options({
  setCurrentView,
}: {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}) {
  const clearProv = useVars((state) => state.clearProvider);
  const setDebug = useVars((state) => state.setDebugLabs);
  return (
    <div>
      <div className="flex gap-5">
        <div>
          <Button onClick={() => setCurrentView("home")}>
            <ChevronLeft /> Back
          </Button>
        </div>
        <div className="my-auto">Options</div>
      </div>

      <div>
        {/* LIMITED TIME ONLY: these buttons being visible to the public */}
        <div className="grid grid-cols-12">
          <div className="cols col-span-6 me-6 my-2">
            <Button className="w-full" onClick={setDebug}>
              Debug Labs
            </Button>
          </div>
          <div className="cols col-span-6 my-2" onClick={clearProv}>
            <Button className="w-full">Clear Provider</Button>
          </div>
        </div>
      </div>

      {/* about bqm */}
      <div>
        <p className="text-center text-sm">
          bus? v3. Created by{" "}
          <a href="https://github.com/weareblahs">Tan (weareblahs)</a>.{" "}
          <a href="https://github.com/weareblahs/bus">Source code</a>
          <br />
          Realtime GTFS / bus position data and static bus position data from{" "}
          <a href="https://data.gov.my">data.gov.my</a>. Used under CC BY 4.0.
          <br />
          This web app uses{" "}
          <a href="https://openrouteservice.org">OpenRouteService</a> for
          reverse geocoding and routing sections of the web app.
          <br />© openrouteservice.org by HeiGIT | Map data © OpenStreetMap
          contributors
          <br />
          <b>
            Do note that the data displayed in this website / web application is
            for reference only and could be sometimes inaccurate for realtime
            positioning data.
          </b>
        </p>
      </div>
    </div>
  );
}
