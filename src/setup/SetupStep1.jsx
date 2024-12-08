import { useState } from "react";
import providers from "../privData/providers.json";
import { button, Button } from "@nextui-org/react";
import { FaBus } from "react-icons/fa";
import Cookies from "js-cookie";
export const SetupStep1 = () => {
  const [provider, setProvider] = useState("");
  const [buttonStatus, setStatus] = useState(false);
  const [state, setState] = useState("");
  const [buttonShowing, setButton] = useState("w-100 snap-center fixed hidden");
  if (buttonStatus == false) {
    setStatus(
      "grid grid-cols-2 hover:bg-white hover:text-black transition-all p-6 rounded-lg"
    );
  }

  const setAll = (provider, state) => {
    setStatus(
      "grid grid-cols-2 bg-white text-black transition-all p-6 rounded-lg"
    );
    setButton("w-100 snap-center fixed bottom-8");
    setProvider(provider);
    setState(state);
    console.log(provider);
  };
  const startApp = () => {
    Cookies.set("isSetUp", true);
    Cookies.set("provider", provider);
    Cookies.set("state", state);
    window.location.reload();
  };
  return (
    <>
      <div className="w-100 p-10 mt-4 mb-4 dark">
        <h1 className="text-center text-4xl">
          <b>Welcome to bus?</b>
        </h1>
        <h4 className="text-center">To start, please select a bus provider.</h4>
        <div className="row-auto grid grid-cols-1">
          {providers.map((p) => {
            return (
              <div
                className={buttonStatus}
                onClick={() => setAll(p.providerName, p.state)}
              >
                <div className="col-span-1 ms-auto me-auto mt-auto mb-auto text-4xl">
                  <FaBus />
                </div>
                <div className="col-span-1">
                  <h1 className="">
                    {p.providerName}
                    <br />
                    {p.state}, {p.country}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
        <div className={buttonShowing}>
          <p className="px-1 py-4">
            Tip: to change provider after this setup, start the wizard again by
            going to the "Settings" page.
          </p>
          <Button className="w-52" onClick={() => startApp()}>
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};
