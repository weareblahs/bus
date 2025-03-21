import { DataCard } from "./Components/DataCard";

export const DataDisplay = ({ data }) => {
  console.log(data.status);
  if (data.length != 0) {
    if (data.status && data.status == "loading") {
      return (
        <div className="ms-auto me-auto">
          <h1 className="text-3xl text-center mt-5 mb-5">
            Loading realtime data...
          </h1>
        </div>
      );
    } else {
      if (data[0].data_available) {
        if (data[0].data.length != 0) {
          return (
            <div>
              <h1 className="mt-2">Available bus routes (realtime)</h1>
              <div className="grid lg:grid-cols-3">
                {data[0].data.map((d) => {
                  return (
                    <div className="ms-2 me-2">
                      <DataCard singleData={d} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else if (
          !data[0].data_available &&
          data[0].data.response?.status == 429
        ) {
          return (
            <h1 className="text-3xl text-center mt-5 mb-5">
              It looks like you've been searching too fast. Try again in a few
              seconds.
            </h1>
          );
        }
        return (
          <div className="ms-auto me-auto">
            <h1 className="text-3xl text-center mt-5 mb-5">
              Realtime data unavailable.
            </h1>
            {data[1].nextDeparture ? (
              <h1 className="text-xl text-center mt-5 mb-5">
                Next bus will be departing from the hub of this route (
                <span className="font-bold italic">
                  {data[1].nextDeparture?.stop_name}
                </span>
                ) on <b>{data[1].nextDeparture?.first_stop_time}</b>. To check
                other information, see below.
              </h1>
            ) : null}
          </div>
        );
      }
    }
  }
};
