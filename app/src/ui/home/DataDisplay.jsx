import { useState, useEffect } from "react";
import { DataCard } from "./Components/DataCard";

export const DataDisplay = ({ data }) => {
  const [rtd, setRealtimeData] = useState(data);
  useEffect(() => {
    setRealtimeData(data);
  }, [data]);

  if (rtd.length != 0) {
    if (rtd.status && rtd.status == "loading") {
      return (
        <div className="ms-auto me-auto">
          <h1 className="text-3xl text-center mt-5 mb-5">
            Loading realtime data...
          </h1>
        </div>
      );
    } else {
      if (rtd[0].data_available) {
        if (rtd[0].data.length != 0) {
          return (
            <div>
              <div className="grid grid-cols-2">
                <div>
                  {" "}
                  <h1 className="mt-2">Available bus routes (realtime)</h1>
                </div>
                <div>{/* reserved for future use */}</div>
              </div>
              <div className="grid lg:grid-cols-3">
                {rtd[0].data.map((d) => {
                  return (
                    <div className="ms-2 me-2">
                      {/* <DataCard singleData={d} /> */}
                      temporary datacard placeholders so no rate limits will be
                      applied for this one
                    </div>
                  );
                })}
              </div>

              <h1 className="text-center w-[100%]">
                {" "}
                Static data feature is not available on this instance. To view
                static data / static bus schedule, visit{" "}
                <a href="https://bqm.vercel.app" className="underline">
                  the original version of bus?
                </a>
                .
              </h1>
            </div>
          );
        } else if (rtd[0].data_available == false) {
        }
        return (
          <div className="ms-auto me-auto">
            <h1 className="text-3xl text-center mt-5 mb-5">
              Realtime data unavailable.
            </h1>
          </div>
        );
      }
      return (
        <h1 className="text-3xl text-center mt-5 mb-5">
          It looks like you've been searching too fast. Try again in a few
          seconds.
        </h1>
      );
    }
  }
};
