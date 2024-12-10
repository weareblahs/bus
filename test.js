import axios from "axios";

export const getNearest = (lat, lon, rte, provider, state) => {
  //   const [data, setData] = useState([]);
  // reference URL: http://localhost:5173/data/Penang/rapidPenang/StnInfo/301B.json
  const url = `http://localhost:5173/data/Penang/rapidPenang/StnInfo/${rte}.json`;
  console.log(url);
  axios.get(url).then((res) => {
    const nearest0 = res.data.filter(
      (d) => d?.stop_lat >= lat && d?.stop_lon >= lon
    );
    const nearest = nearest0[nearest0.length - 1];
    const getDistance = distance(
      nearest.stop_lat,
      nearest.stop_lon,
      lat,
      lon,
      "K"
    );
    // const prevDataCheck = (res.data.indexOf(nearest)-1) >= 0) ? (res.data.indexOf(nearest) - 1) : -1
    // const nextDataCheck = (res.data.indexOf(nearest)+1) <= (res.data.length-1) ? (res.data.indexOf(nearest) + 1) : -1
    console.log(nearest, getDistance);
  });
};

getNearest(5.341578006744385, 100.27124786376953, "301A");
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
