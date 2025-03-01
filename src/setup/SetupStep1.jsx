import { useState } from "react";
import providers from "../privData/providers.json";
import { button, Button } from "@nextui-org/react";
import { FaBus } from "react-icons/fa";
import Cookies from "js-cookie";
export const SetupStep1 = () => {
  const [provider, setProvider] = useState("");
  const [buttonStatus, setStatus] = useState(false);
  const [state, setState] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [buttonShowing, setButton] = useState("w-100 snap-center fixed hidden");
  if (buttonStatus == false) {
    setStatus(
      "grid grid-cols-2 hover:bg-white hover:text-black transition-all p-6 rounded-lg"
    );
  }

  const setAll = (provider, state, endpoint) => {
    setStatus(
      "grid grid-cols-2 bg-white text-black transition-all p-6 rounded-lg"
    );
    setButton("w-100 snap-center fixed bottom-8");
    setProvider(provider);
    setState(state);
    setEndpoint(endpoint);
  };
  const startApp = () => {
    Cookies.set("isSetUp", true, { expires: 365 });
    Cookies.set("provider", provider, { expires: 365 });
    Cookies.set("state", state, { expires: 365 });
    Cookies.set("endpoint", endpoint, { expires: 365 });
    window.location.reload();
  };
  return (
    <>
      <div className="w-100 m-5 dark">
        <h1 className="text-center text-4xl">
          <b>Welcome to bus?</b>
        </h1>
        <h4 className="text-center mb-5">
          To start, please select a bus provider.
        </h4>
        <div className="row-auto grid grid-cols-1">
          {providers.map((p) => {
            return (
              <div
                className="grid grid-cols-4 hover:bg-white hover:text-black transition-all p-6 rounded-lg"
                onClick={() => setAll(p.providerName, p.state, p.endpoint)}
              >
                <div className="col-span-1 ms-auto me-auto mt-auto mb-auto text-4xl">
                  <FaBus />
                </div>
                <div className="col-span-3">
                  <h1 className="text-2xl">{p.providerName}</h1>
                  <p>
                    {p.state}, {p.country}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={buttonShowing}>
          <p className="px-1 py-4">
            Tip: to change provider after this setup, start the wizard again by
            going to the "Settings" page. Your selected data will be stored
            locally for up to 1 year.
          </p>
          <div className="w-52">
            <Button
              className=""
              style={{ width: "100%" }}
              onClick={() => startApp()}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
