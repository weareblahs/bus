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
export const NearbyDisplayLanguage = () => {
  const redirect = useNavigate();
  const [lang, setLang] = useState();
  useEffect(() => {
    setLang(JSON.parse(Cookies.get("geoLanguage"))[1]);
  }, [lang]);
  const setGeoLang = (e) => {
    setLang(e);
    console.log(e);
    Cookies.set("geoLanguage", e, { expires: 365 });
  };
  return (
    <div className="grid lg:grid-cols-2 bg-gray-950 dark:bg-gray-900 p-5 m-5 rounded-2xl">
      <div>
        <h1 className="text-2xl text-white ">Language for location display</h1>
        <h1 className="text-medium text-white ">
          This option changes the language for the current location part for
          live feed. Language availability depends on OpenStreetMap's data.
        </h1>
      </div>
      <div className="ms-auto me-auto mt-2 mb-2 lg:mt-auto lg:mb-auto">
        <Listbox className="" onChange={(e) => setGeoLang(e)}>
          <div className="relative mt-2">
            <ListboxButton className="grid w-66 lg:w-100 cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                {lang}
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
                key="en"
                value={`["en", "English"]`}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex items-center">English</div>
              </ListboxOption>
              <ListboxOption
                key="zh"
                value={`["zh", "简体中文"]`}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex items-center">简体中文</div>
              </ListboxOption>
              <ListboxOption
                key="ms"
                value={`["ms", "Bahasa Melayu"]`}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex items-center">Bahasa Melayu</div>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
  );
};
