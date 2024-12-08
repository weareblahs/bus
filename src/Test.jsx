import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
export const Test = () => {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    axios
      .get(`http://${window.location.host}/data/penang/stationList.json`)
      .then((res) => setStationList(res.data));
  }, []);
  const [sd, setSD] = useState([]);

  const get = async (v1, v2, v3) => {
    const data = await getStationStops(v1, v2, v3);
    setSD(data.data);
  };
  return (
    <>
      <h1>List test</h1>
      <select onChange={(e) => get("penang", "rapidPenang", e.target.value)}>
        {stationList.map((s) => {
          return (
            <option value={s.id}>
              {s.id}: {s.name}
            </option>
          );
        })}
      </select>

      <ul>
        {sd.length !== 0
          ? sd.map((s) => {
              return (
                <li>
                  {s.stop_name} ({s.stop_lat}, {s.stop_lon})
                </li>
              );
            })
          : null}
      </ul>
    </>
  );
};
