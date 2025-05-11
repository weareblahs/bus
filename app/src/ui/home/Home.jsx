import { useEffect } from "react";
import { RouteSelectionDropdown } from "./RouteSelectionDropdown";
import { downloadRoutes } from "../../functions/DownloadRouteList";
import Cookies from "js-cookie";
import { DataRefresh } from "./DataRefresh";
import { Header } from "./Header";
import { useState } from "react";
import { Popup } from "./Components/Popup";
import { BusCheck } from "./BusCheck";

export const Home = () => {
  const mode = JSON.parse(Cookies.get("displayMethod"))[0];
  // checks if list of routes is downloaded. if not, then download. stored in localstorage
  const [popupCardData, setPopupCardData] = useState("");
  useEffect(() => {
    async function get() {
      const data = await downloadRoutes(Cookies.get("provider"));
      localStorage.setItem("routeData", JSON.stringify(data));
    }

    if (!localStorage.getItem("routeData")) {
      get();
    }
  }, []);

  useEffect(() => {
    console.log("popup");
  }, [popupCardData]);
  return (
    <div className="p-5 lg:ps-8 lg:pe-8 lg:pt-6 lg:pb-6">
      <Header />
      {localStorage.getItem("routeData") ? (
        mode == "default" ? (
          <RouteSelectionDropdown setPopupCardData={setPopupCardData} />
        ) : (
          <BusCheck />
        )
      ) : (
        <DataRefresh />
      )}
      <Popup text={popupCardData} />
    </div>
  );
};
