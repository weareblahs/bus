import axios from "axios";

export const getStationStops = async (state, provider, route) => {
  const data = ky.get(
    `http://${window.location.host}/data/${state}/${provider}StnInfo/${route}.json`
  );
  return data.json();
};
