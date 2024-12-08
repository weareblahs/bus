import axios from "axios";
import { useState } from "react";

export const getStationStops = async (state, provider, route) => {
  const data = axios.get(
    `http://${window.location.host}/data/${state}/${provider}StnInfo/${route}.json`
  );
  return data;
};
