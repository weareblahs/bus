import { useEffect, useState } from "react";
import { button } from "../../../styling/Classnames";
import { FaStreetView } from "react-icons/fa";
import { geocoding } from "../../../functions/getData";
export const DataCard = ({ singleData }) => {
  console.log(singleData);
  console.log();
  const [geocode, setGeocode] = useState("");
  useEffect(() => {
    async function get() {
      setGeocode("Retrieving location data...");
      const geocodingData = await geocoding(
        singleData.position_lat,
        singleData.position_lon
      );
      console.log(geocodingData);
      if (geocodingData) {
        setGeocode(`Bus near ${geocodingData}`);
      } else {
        setGeocode(
          "Location data retrieving failed. You can still use the Street View button at the right."
        );
      }
    }
    get();
  }, []);
  return (
    <div className="bg-black dark:bg-white text-white dark:text-black w-[100%] mt-2 mb-2 rounded-md p-2">
      <div className="grid grid-cols-4">
        <div className="col-span-1">{singleData.vehicle_plate}</div>
        <div className="text-end col-span-3">
          <span className="bg-green-600 px-2 py-1 rounded-xl text-sm text-white ">
            currently on {singleData.vehicle_speed}km/h
          </span>
        </div>
      </div>
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
