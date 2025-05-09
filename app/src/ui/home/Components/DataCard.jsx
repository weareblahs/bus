import { useEffect, useState } from "react";
import { button } from "../../../styling/Classnames";
import { FaStreetView } from "react-icons/fa";
import { geocoding, getNearbyStation, osrm } from "../../../functions/getData";
export const DataCard = ({ singleData }) => {
  const [geocode, setGeocode] = useState("");
  const [nearbyStationData, setNearby] = useState([]);
  const [currentNearbyData, setOSRM] = useState(-1);
  const [remainingTime, setRemaining] = useState(-1);
  useEffect(() => {
    async function get() {
      setGeocode("Retrieving location data...");
      const geocodingData = await geocoding(
        singleData.position_lat,
        singleData.position_lon
      );
      const nearbyStationData = await getNearbyStation(
        singleData.route,
        singleData.position_lat,
        singleData.position_lon
      );
      setNearby(nearbyStationData);
      const osrmData = await osrm(
        singleData.position_lat,
        singleData.position_lon,
        nearbyStationData[1].lat,
        nearbyStationData[1].long
      );
      if (osrmData != []) {
        setOSRM(osrmData[0]);
        setRemaining(osrmData[1]);
      }
      if (geocodingData) {
        setGeocode(`Bus near ${geocodingData}`);
      } else {
        setGeocode(
          "Location data retrieving failed. You can still use the Street View button at the right."
        );
      }
    }
    get();
  }, [singleData]);
  return (
    <div className="bg-black dark:bg-white text-white dark:text-black w-[100%] mt-2 mb-2 rounded-md p-2">
      {/* header */}
      <div className="grid grid-cols-4">
        <div className="col-span-1">{singleData.vehicle_plate}</div>
        <div className="text-end col-span-3">
          <span className="bg-green-600 px-2 py-1 rounded-xl text-sm text-white ">
            {singleData.vehicle_speed > 0
              ? `Currently on ${singleData.vehicle_speed}km/h`
              : "Waiting"}
          </span>
        </div>
      </div>
      {/* next station */}
      {nearbyStationData.length != 0 ? (
        <div className="grid grid-cols-1 text-center mt-1 mb-1">
          <div className="mt-auto  mb-auto col-span-2 p-1 line-clamp-2">
            {nearbyStationData[0]?.name
              ? nearbyStationData[0]?.name
              : "Unknown Station"}
          </div>
          <div className="bg-blue-500 rounded-md p-3 text-4xl ms-auto me-auto col-span-4">
            <h1 className="text-4xl text-center text-white ">
              {nearbyStationData[1]?.name
                ? nearbyStationData[1]?.name
                : "Unknown station"}
            </h1>
            <p className="text-base text-white text-center">
              {currentNearbyData != -1
                ? `${currentNearbyData}m 
                ${
                  remainingTime < 60
                    ? `(< 1 min)`
                    : `(${Math.round(remainingTime / 60)} min${
                        Math.round(remainingTime / 60) > 1 ? "s" : ""
                      })`
                } left until arrival`
                : null}
            </p>
            <h1 className="text-base text-start text-white"></h1>
          </div>
          <div className="mt-auto col-span-2 p-2">
            {nearbyStationData[2]?.name
              ? nearbyStationData[2]?.name
              : "Unknown Station"}
          </div>
        </div>
      ) : null}
      <div></div>
      {/* "bus near" and street view button */}
      <div className="grid grid-cols-4 mt-1 mb-1">
        <div className="col-span-3 text-base/tight mt-auto  mb-auto pe-2">
          {geocode}
        </div>
        <div className="col-span-1 mt-auto mb-auto">
          <button
            className={`${button} w-[100%] `}
            onClick={() =>
              (window.location.href = `https://maps.google.com/maps?q=&layer=c&cbll=${singleData.position_lat},${singleData.position_lon}`)
            }
          >
            <FaStreetView className="text-lg mt-2 mb-2 ms-auto me-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};
