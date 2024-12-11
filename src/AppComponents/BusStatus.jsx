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
import { FaMap } from "react-icons/fa";
export const BusStatus = (data) => {
  // const data0 = JSON.stringify(data);
  if (data != []) {
    return (
      <div className="flex w-11/12">
        <div className="mb-24">
          <div className="mt-auto mb-auto ms-4 me-4">Bus information</div>
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
                <Card
                  className="w-12/12 mb-4 ms-2 me-2 bg-gray-800 text-white p-1"
                  style={{
                    marginLeft: "",
                    marginRight: "auto",
                  }}
                >
                  <div key={d[0].id} className="">
                    <CardHeader>
                      <div className="grid ">
                        <div className="mt-auto mb-auto">
                          <h1 key={d[0].id}>
                            {d[0].vehicle.vehicle.licensePlate}
                          </h1>
                          <h1>
                            {d[0].vehicle.position.speed == 0
                              ? `Bus is stopped or waiting for traffic light`
                              : `Currently driving in ${d[0].vehicle.position.speed}km/h`}
                          </h1>
                          <h1 className="text-3xl py-4">
                            <div
                              className="text-center w-96"
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              <div>
                                <div>
                                  <h1 className="text-medium text-center mt-auto italic">
                                    {nearest?.[0]?.prev
                                      ? nearest?.[0].dist >= 30000
                                        ? "unknown location"
                                        : nearest?.[0].prev
                                      : "unknown location"}
                                  </h1>
                                </div>
                              </div>
                              <div className="text-2xlms-auto me-auto">
                                <h1>
                                  {nearest?.[0]?.curr
                                    ? nearest?.[0].dist >= 30000
                                      ? "unknown location"
                                      : nearest?.[0].curr
                                    : "unknown location"}
                                  {nearest?.[0]?.curr ? (
                                    <p className="text-medium">
                                      <i>
                                        {nearest?.[0].dist <= 100 ? (
                                          nearest?.[0].dist <= 10 ? (
                                            <Chip>
                                              Bus has arrived at the station
                                            </Chip>
                                          ) : (
                                            <Chip>
                                              Bus will be arriving shortly
                                            </Chip>
                                          )
                                        ) : nearest?.[0].dist >= 10000 ? (
                                          <i className="text-medium">
                                            Do note that above station info is
                                            inaccurate unless the actual
                                            distance between this station and
                                            the next station is considered as an
                                            express bus.
                                          </i>
                                        ) : (
                                          <Chip>
                                            {nearest?.[0].dist}m away from
                                            station
                                          </Chip>
                                        )}
                                      </i>
                                    </p>
                                  ) : null}
                                </h1>
                              </div>
                              <div>
                                <div>
                                  <h1 className="text-medium text-center mt-auto italic">
                                    {nearest?.[0]?.next
                                      ? nearest?.[0].dist >= 30000
                                        ? "unknown location"
                                        : nearest?.[0].next
                                      : "unknown location"}
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </h1>
                        </div>
                      </div>
                    </CardHeader>
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
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h1 className="text-center">
        Data unavailable. Please re-select station in a few minutes.
      </h1>
    );
  }
};
