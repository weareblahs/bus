import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import { nominatim, redirToGoogleMaps } from "./MapTools";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getNearest } from "./getNearest";
import { FaInfo, FaInfoCircle, FaMap } from "react-icons/fa";
export const BusStatus = (data) => {
  // const data0 = JSON.stringify(data);
  if (data.data.length != 0) {
    //
    return (
      <>
        <div className="ms-auto me-auto mb-24">
          <div>
            <h1 className="text-2xl text-center p-2">
              <div>Bus info</div>
            </h1>
          </div>
          <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2">
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
              return (
                <Card className="bg-gray-900 text-white ms-auto me-auto w-80 mb-4">
                  <CardHeader>
                    <div className="grid grid-cols-2">
                      <div className="w-52 mt-auto mb-auto">
                        {d[0].vehicle.vehicle.licensePlate}
                      </div>
                      <div className="text-end">
                        {d[0].vehicle.position.speed == 0 ? (
                          <Chip className="bg-red-500 text-white">Waiting</Chip>
                        ) : (
                          <Chip className="bg-green-500">
                            {d[0].vehicle.position.speed.toFixed(0)}km/h
                          </Chip>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="mt-0">
                    <div className="grid grid-cols-1">
                      <h1 className="text-center italic">
                        {nearest?.[0]?.prev
                          ? nearest?.[0].dist >= 30000
                            ? "unknown location"
                            : nearest?.[0].prev
                          : "unknown location"}
                      </h1>
                    </div>
                    <div className="grid grid-cols-1">
                      <h1 className="text-center text-4xl">
                        {nearest?.[0]?.curr
                          ? nearest?.[0].dist >= 30000
                            ? "unknown location"
                            : nearest?.[0].curr
                          : "unknown location"}
                      </h1>
                      <div className="ms-auto me-auto m-1">
                        {nearest?.[0]?.curr ? (
                          nearest?.[0].dist <= 500 ? (
                            nearest?.[0].dist <= 10 ? (
                              <Chip className="bg-green-500">
                                Bus has arrived at the station
                              </Chip>
                            ) : (
                              <Chip className="bg-orange-500">
                                Bus will be arriving shortly
                              </Chip>
                            )
                          ) : nearest?.[0].dist >= 10000 ? (
                            <i className="text-small">
                              Do note that above station info is inaccurate
                              unless the actual distance between this station
                              and the next station is considered as an express
                              bus.
                            </i>
                          ) : (
                            <Chip className="bg-blue-500">
                              {nearest?.[0].dist}m away from station
                            </Chip>
                          )
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-1">
                      <h1 className="text-center italic">
                        {nearest?.[0]?.next
                          ? nearest?.[0].dist >= 30000
                            ? "unknown location"
                            : nearest?.[0].next
                          : "unknown location"}
                      </h1>
                    </div>
                  </CardBody>
                  <CardFooter className="px-2 py-2">
                    {" "}
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
                            className="mt-auto mb-auto"
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
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1 className="text-center text-4xl p-4">
          Data unavailable or bus route is closed for this time.
        </h1>

        <h1 className="text-center text-xl px-6">
          To check for other routes, please change the bus route on the Bus
          Route selection.
        </h1>
      </>
    );
  }
};
