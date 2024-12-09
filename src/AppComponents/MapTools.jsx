import axios from "axios";
import { useEffect, useState } from "react";

export const NearestStation = (lon, lat, rte) => {
  // longitude, latitude, route
};

export const nominatim = (lon, lat) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      .then((res) => setData(res.data));
  }, []);
  return data;
};

export const redirToGoogleMaps = (lon, lat) => {
  window.location.href = `https://maps.google.com/?q=${lat},${lon}`;
};
