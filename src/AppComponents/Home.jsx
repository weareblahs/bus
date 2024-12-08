import { Badge, Button, Chip, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
export const Home = () => {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://${window.location.host}/data/${Cookies.get(
          "state"
        )}/${Cookies.get("provider")}.json`
      )
      .then((res) => setStationList(res.data));
  }, []);
  const [sd, setSD] = useState([]);
  return (
    <>
      <div className="p-4 text-black dark ce">
        <Select aria-label="Select">
          {stationList.map((s) => {
            return (
              <SelectItem className="dark text-black" textValue={s.name}>
                <Chip className="bg-blue-600 me-4">{s.id.slice(0, -1)}</Chip>
                {s.name}
              </SelectItem>
            );
          })}
        </Select>
      </div>
      <div
        className="fixed bottom-8 w-100 block ms-auto me-auto text-center"
        style={{ width: "100vw" }}
      >
        <p className="text-center">
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
