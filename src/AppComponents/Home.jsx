import { Badge, Button, Chip, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getData, getStaticTrips } from "./getData";
import { BusStatus } from "./BusStatus";
import { FaExchangeAlt } from "react-icons/fa";
export const Home = () => {
  const [stationList, setStationList] = useState([]);

  const [data, setData] = useState([{ status: "No route selected" }]);

  const [staticData, setD2] = useState([]);

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
    const d2 = await getStaticTrips(route);
    setData(d);
    if (d2) {
      setD2(d2);
    }
  };

  return (
    <>
      <div className="text-center mt-5">
        <span className="italic">
          {Cookies.get("provider")} selected as bus provider
        </span>
      </div>
      <div className="grid grid-cols-10 text-black dark p-3 me-5">
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
                <div className="grid grid-cols-4 pt-2 pb-2">
                  <div className="col col-span-2 mt-auto mb-auto ms-auto">
                    <Chip className="rounded-md bg-blue-600 me-4 text-white mono">
                      {s.id.slice(0, -1)}{" "}
                      {s.id.slice(-1) == "A"
                        ? " ▶"
                        : s.id.slice(-1) == "B"
                        ? " ◀"
                        : null}
                    </Chip>
                  </div>
                  <div className="col col-span-2 mt-auto mb-auto">
                    {" "}
                    <h1 className="text-xs leading-1 line-clamp-2">{s.name}</h1>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </Select>
        <Button
          onPress={() => {
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
          <BusStatus
            data={JSON.parse(data)}
            staticData={staticData}
            route={route}
          />
        ) : (
          <h1 className="text-center text-4xl p-4">{data[0].status}</h1>
        )}
      </div>
      <div>
        <div className="fixed bottom-0 block text-center bg-black p-4">
          <p className="lg:text-left md:text-center sm:text-center">
            <span className="text-sm">
              Data sourced from data.gov.my which is used under the terms of
              use, which can be viewed{" "}
              <a
                href="https://archive.data.gov.my/p/terma-pengguna"
                className="underline"
              >
                here
              </a>{" "}
              (in Malay). <br />
              <a href="https://github.com/weareblahs/bus" className="underline">
                Source code
              </a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
