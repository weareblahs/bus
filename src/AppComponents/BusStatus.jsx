import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { nominatim, redirToGoogleMaps } from "./MapTools";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getNearest } from "./getNearest";
import { FaMap } from "react-icons/fa";
export const BusStatus = (data, route) => {
  // const data0 = JSON.stringify(data);
  return (
    <>
      <div className="grid px-8 mb-24">
        <div className="mt-auto mb-auto">Bus information</div>
        <div className="ms-auto"></div>
        <div className="">
          {data.data.map((d) => {
            let vehicleCLD = nominatim(
              d[0].vehicle.position.longitude,
              d[0].vehicle.position.latitude
            );
            let nearest = getNearest(
              d[0].vehicle.position.latitude,
              d[0].vehicle.position.longitude,
              data.route,
              Cookies.get("provider"),
              Cookies.get("state")
            );
            let info = [];
            console.log(nearest);
            return (
              <Card className="mb-4 bg-gray-800 text-white">
                <div key={d[0].id} className="p-2">
                  <CardHeader>
                    <div className="grid">
                      <div className="mt-auto mb-auto">
                        <h1 key={d[0].id}>
                          {d[0].vehicle.vehicle.licensePlate}
                        </h1>
                        <h1>
                          {d[0].vehicle.position.speed == 0
                            ? `Bus is now waiting for traffic light`
                            : `Currently driving in ${d[0].vehicle.position.speed}km/h`}
                        </h1>
                        <h1 className="text-4xl py-4">
                          <h1>
                            near{" "}
                            {nearest?.[0]?.curr
                              ? nearest?.[0]?.curr
                              : "unknown location"}
                          </h1>
                        </h1>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {vehicleCLD.length != 0 ? (
                      <>
                        <div className="grid grid-cols-2">
                          <div className="mt-auto mb-auto">
                            <p className="mt-auto mb-auto me-4">
                              Bus near{" "}
                              {vehicleCLD.address.road
                                ? vehicleCLD.address.road
                                : vehicleCLD.address.neighbourhood}
                              ,{" "}
                              {vehicleCLD.address.city
                                ? vehicleCLD.address.city
                                : vehicleCLD.address.district}
                              , {vehicleCLD.address.state}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              redirToGoogleMaps(
                                d[0].vehicle.position.longitude,
                                d[0].vehicle.position.latitude
                              )
                            }
                          >
                            <FaMap />
                          </Button>
                        </div>
                      </>
                    ) : null}
                  </CardBody>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};
