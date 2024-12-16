import { Badge, Button, Chip, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getData } from "./getData";
import { BusStatus } from "./BusStatus";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaBus,
  FaExchangeAlt,
} from "react-icons/fa";
export const Home = () => {
  const [stationList, setStationList] = useState([]);

  const [data, setData] = useState([{ status: "No route selected" }]);

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
  };
  const [sd, setSD] = useState([]);
  return (
    <>
      <div className="text-center mt-5">
        <span className="italic">
          {Cookies.get("provider")} selected as bus provider
        </span>
      </div>
      <div className="grid grid-cols-10 text-black dark p-2">
        <Select
          aria-label="Select"
          className="p-2 col-span-8"
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
                <Chip className="rounded-md bg-blue-600 me-4 text-white mono">
                  {s.id.slice(0, -1)}{" "}
                  {s.id.slice(-1) == "A"
                    ? " ▶"
                    : s.id.slice(-1) == "B"
                    ? " ◀"
                    : null}
                </Chip>
                {s.name}
              </SelectItem>
            );
          })}
        </Select>
        <Button
          onClick={() => {
            Cookies.remove("isSetUp");
            window.location.reload();
          }}
          className="col-span-2 mt-auto mb-auto p-7 bg-slate-800"
        >
          <FaExchangeAlt />
        </Button>
      </div>
      <div className="ms-auto me-auto">
        {!data[0].status ? (
          <BusStatus data={JSON.parse(data)} route={route} />
        ) : (
          <h1 className="text-center text-4xl p-4">{data[0].status}</h1>
        )}
      </div>
      <div
        className="fixed bottom-0 w-100 block ms-auto me-auto text-center bg-black p-5"
        style={{ width: "100vw" }}
      >
        <p className="text-center ">
          <span className="p-4">
            <br />
            Data sourced from data.gov.my which is used under the terms of use,
            which can be viewed{" "}
            <a
              href="https://archive.data.gov.my/p/terma-pengguna"
              className="underline"
            >
              here
            </a>{" "}
            (in Malay).
          </span>
        </p>
      </div>
    </>
  );
};
