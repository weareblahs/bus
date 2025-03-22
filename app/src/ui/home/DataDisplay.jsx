import { useState, useEffect } from "react";
import { DataCard } from "./Components/DataCard";

export const DataDisplay = ({ data }) => {
  const [rtd, setRealtimeData] = useState(data);
  useEffect(() => {
    setRealtimeData(data);
  }, [data]);
  console.log(rtd);
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
              <h1 className="mt-2">Available bus routes (realtime)</h1>
              <div className="grid lg:grid-cols-3">
                {rtd[0].data.map((d) => {
                  return (
                    <div className="ms-2 me-2">
                      <DataCard singleData={d} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else if (rtd[0].data_available == false) {
          console.log(data);
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
