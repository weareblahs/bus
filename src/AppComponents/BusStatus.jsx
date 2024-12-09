import { Button } from "@nextui-org/react";
import { nominatim, redirToGoogleMaps } from "./MapTools";

export const BusStatus = (data) => {
  const data0 = JSON.stringify(data);
  return (
    <>
      <div className="grid grid-cols-2 px-8">
        <div className="mt-auto mb-auto">Bus information</div>
        <div className="ms-auto">
          <Button>Refresh</Button>
        </div>
        <div>
          {data.data.map((d) => {
            let vehicleCLD = nominatim(
              d[0].vehicle.position.longitude,
              d[0].vehicle.position.latitude
            );
            console.log(vehicleCLD);
            return (
              <>
                <div key={d[0].id} className="p-2">
                  <h1 key={d[0].id}>{d[0].vehicle.vehicle.licensePlate}</h1>
                  {vehicleCLD.length != 0 ? (
                    <>
                      <h1 className="text-4xl">
                        Bus near{" "}
                        {vehicleCLD.address.road
                          ? vehicleCLD.address.road
                          : vehicleCLD.address.neighbourhood}
                      </h1>
                      <div className="flex">
                        <p className="mt-auto mb-auto me-4">
                          {vehicleCLD.address.city
                            ? vehicleCLD.address.city
                            : vehicleCLD.address.district}
                          , {vehicleCLD.address.state}
                        </p>
                        <Button
                          onClick={() =>
                            redirToGoogleMaps(
                              d[0].vehicle.position.longitude,
                              d[0].vehicle.position.latitude
                            )
                          }
                        >
                          View via Google Maps
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
