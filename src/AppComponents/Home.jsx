import { Badge, Button, Chip, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getData } from "./getData";
import { BusStatus } from "./BusStatus";
export const Home = () => {
  const [stationList, setStationList] = useState([]);

  const [data, setData] = useState([{ status: "No bus station selected" }]);

  const [route, setRoute] = useState("");
  useEffect(() => {
    axios
      .get(
        `${window.location.protocol}//${
          window.location.host
        }/data/${Cookies.get("state")}/${Cookies.get("provider")}.json`
      )
      .then((res) => setStationList(res.data));
  }, []);
  const setTrip = async (route) => {
    setRoute(route);
    setData([{ status: "Loading..." }]);
    const d = await getData(route);
    setData(d);
    console.log(data);
  };
  const [sd, setSD] = useState([]);
  return (
    <>
      <div className="p-4 text-black dark">
        <Select
          aria-label="Select"
          className="p-4"
          onChange={(e) => setTrip(e.target.value)}
          placeholder="Select route..."
          label="Bus route"
        >
          {stationList.map((s) => {
            return (
              <SelectItem
                key={s.id}
                className="dark text-black"
                textValue={s.name}
              >
                <Chip className="bg-blue-600 me-4">{s.id.slice(0, -1)}</Chip>
                {s.name}
              </SelectItem>
            );
          })}
        </Select>
      </div>
      {!data[0].status ? (
        <BusStatus data={JSON.parse(data)} route={route} />
      ) : (
        <h1 className="text-center">{data[0].status}</h1>
      )}
      <div
        className="fixed bottom-0 w-100 block ms-auto me-auto text-center bg-black p-5"
        style={{ width: "100vw" }}
      >
        <p className="text-center ">
          {Cookies.get("provider")} selected. Not your preferred provider?
          <span className="p-4">
            <Button
              onClick={() => {
                Cookies.remove("isSetUp");
                window.location.reload();
              }}
            >
              Change provider
            </Button>
          </span>
        </p>
      </div>
    </>
  );
};
