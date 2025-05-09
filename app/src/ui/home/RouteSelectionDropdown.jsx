import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { routeIndicator } from "../../functions/RouteIndicator";
import { getData, getStaticTrips } from "../../functions/getData";
import { DataDisplay } from "./DataDisplay";

export const RouteSelectionDropdown = () => {
  const routeData = JSON.parse(localStorage.getItem("routeData"));
  const [selectedRoute, setSelectedRoute] = useState([routeData[0], 0]);
  const [dd, setDisplayData] = useState([]);
  const [timer, toggleTimer] = useState(false);
  const changeData = async (data) => {
    if (dd.length != 2) {
      // check if display data is the
      setDisplayData({ status: "loading" });
    }
    const routeID = selectedRoute[0]["id"];
    const display = await getData(routeID);

    const staticTripData = await getStaticTrips(routeID);
    setDisplayData([display, staticTripData]);

    toggleTimer(true);
  };

  useEffect(() => {
    changeData(selectedRoute);
  }, [selectedRoute]);

  // if you are asking: yes, i did ask claude.ai to fix it.
  // this has been a problem that is stuck in my mind for
  // days since i first started react. thanks to the source
  // that claude sources from though
  useEffect(() => {
    let intervalId;

    if (timer) {
      intervalId = setInterval(() => {
        const now = new Date();
        console.log(`current second: ${now.getSeconds()}`);
        if (now.getSeconds() == 0 || now.getSeconds() == 30) {
          console.log("data refreshing");
          changeData(selectedRoute);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  return (
    <div>
      <p className="mt-2">Select a route:</p>
      <div>
        {/*
            The following code is a modification of https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus,
            which was originally written by the Tailwind CSS team. All the necessary icons (including up / down) for the code
            below are imported according to the guide.
        */}
        <Listbox
          onChange={(d) => {
            setSelectedRoute(d);
          }}
        >
          <div className="relative mt-2">
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <div className="flex items-center">
                  <span className="bg-blue-600 px-4 py-1 rounded-md text-white routeFont ">
                    {routeIndicator(selectedRoute[1])}
                  </span>
                  <span className="ml-3 block truncate font-normal group-data-selected:font-semibold w-50 lg:w-100 text-ellipsis">
                    {selectedRoute[0].name}
                  </span>
                </div>
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
            >
              {routeData.map((route, index) => {
                // get route id stuff
                return (
                  <ListboxOption
                    key={route.id}
                    value={[route, index]}
                    className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                  >
                    <div className="flex items-center">
                      <span className="bg-blue-600 px-4 py-1 rounded-md text-white routeFont">
                        {routeIndicator(index)}
                      </span>
                      <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                        {route.name}
                      </span>
                    </div>
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </div>
        </Listbox>
        <DataDisplay data={dd} />
      </div>
    </div>
  );
};
