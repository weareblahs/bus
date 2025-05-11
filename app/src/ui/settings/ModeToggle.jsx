import {
  Button,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import Cookies from "js-cookie";
import { button } from "../../styling/Classnames";
import { useNavigate } from "react-router-dom";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
export const ModeToggle = () => {
  const [option, setOption] = useState();
  useEffect(() => {
    setOption(JSON.parse(Cookies.get("displayMethod"))[1]);
  }, [option]);

  const optionChange = (e) => {
    console.log(e);
    Cookies.set("displayMethod", e, { expires: 365 });
    setOption(e);
  };
  return (
    <div className="grid lg:grid-cols-2 bg-gray-950 dark:bg-gray-900 p-5 m-5 rounded-2xl">
      <div>
        <div className="flex">
          <h1 className="text-2xl text-white ">Mode</h1>
          <p className="ms-2 me-2 mt-auto mb-auto bg-amber-500 px-2 rounded-full text-black">
            Development in progress
          </p>
        </div>
        <h1 className="text-medium text-white ">
          This option changes operation mode for <i>bus?</i>. Time accuracy
          depends on data provided by OSRM Project. Do note that buses might
          follow a different route.
        </h1>
      </div>
      <div className="ms-auto me-auto mt-2 mb-2 lg:mt-auto lg:mb-auto">
        <Listbox className="" onChange={(e) => optionChange(e)}>
          <div className="relative mt-2">
            <ListboxButton className="grid w-66 lg:w-100 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                {option}
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
              <ListboxOption
                key="arriving"
                value={`["default", "Arriving stations"]`}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="block items-center">
                  <b className="text-base">Arriving stations</b>
                  <p>
                    This mode shows buses and which station will the bus arrive
                    at, which is the default display option for bus?.
                  </p>
                </div>
              </ListboxOption>
              <ListboxOption
                key="reverse"
                value={`["reverse", "Buses arriving"]`}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="block items-center">
                  <b className="text-base">Buses arriving</b>
                  <p>
                    This option lets users select a station and see when will
                    the bus arrive for the selected route.
                  </p>
                </div>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
  );
};
