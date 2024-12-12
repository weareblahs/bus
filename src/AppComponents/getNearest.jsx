import axios from "axios";
import { useEffect, useState } from "react";

export const getNearest = (lat, lon, rte, provider, state) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // reference URL: http://localhost:5173/data/Penang/rapidPenang/StnInfo/301B.json
    const url = `${window.location.protocol}//${window.location.host}/data/${state}/${provider}/StnInfo/${rte}.json`;
    console.log(url);
    axios.get(url).then((res) => {
      const nearest0 = res.data.filter(
        (d) => d?.stop_lat >= lat && d?.stop_lon >= lon
      );
      const nearest = nearest0[0];
      const getDistance = distance(
        nearest.stop_lat,
        nearest.stop_lon,
        lat,
        lon,
        "K"
      );

      setData([
        {
          curr: nearest.stop_name,
          prev: res.data[
            res.data.indexOf(
              res.data.filter(
                (d) => d.stop_sequence === nearest.stop_sequence
              )[0]
            ) - 1
          ].stop_name,
          stopSeq: nearest.stop_sequence,
          next: res.data[
            res.data.indexOf(
              res.data.filter(
                (d) => d.stop_sequence === nearest.stop_sequence
              )[0]
            ) + 1
          ].stop_name,
          dist: (getDistance * 1000).toFixed(2),
        },
      ]);
    });
  }, []);
  console.log(data);
  return data;
};

// source: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}
