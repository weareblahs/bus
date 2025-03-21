import { useState } from "react";
import providers from "../../../internalData/providers.json";
import { FaB, FaBus } from "react-icons/fa6";
import { button } from "../../../styling/Classnames";
import Cookies from "js-cookie";
export const Providers = () => {
  console.log(providers);
  const [selection, setSelection] = useState("");
  const setData = (provider) => {
    Cookies.set("provider", provider, { expires: 365 });
    window.location.reload();
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-[80vw] lg:w-[80vw] ms-auto me-auto cursor-pointer">
      {providers.map((provider) => {
        return (
          <div>
            <div
              className={`grid grid-cols-12 pt-4 pb-4 ps-4 pe-4 mt-1 mb-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl transition animate-fade-out ${
                selection == provider.providerName
                  ? "bg-white text-black light:bg-black light:text-white"
                  : null
              }`}
              key={provider.providerName}
              onClick={() => setSelection(provider.providerName)}
            >
              <div className="col-span-2 ms-auto me-auto text-3xl mt-auto mb-auto">
                <FaBus />
              </div>
              <div className="col-span-10">
                <h1 className="text-3xl font-bold">{provider.providerName}</h1>
                <p className="text-medium">{provider.state}</p>
              </div>
            </div>
          </div>
        );
      })}
      {selection != "" ? (
        <div>
          <div className="block fixed bottom-8">
            <div className="w-50 lg:w-100">
              <button
                className={`${button} w-74 lg:w-100 `}
                onClick={() => setData(selection)}
              >
                Continue
              </button>
            </div>
            <h1 className="text-start lg:text-center text-sm w-74 lg:w-100">
              <i>Note: selected data will be stored locally for up to 1 year</i>
            </h1>
          </div>
        </div>
      ) : null}
    </div>
  );
};
