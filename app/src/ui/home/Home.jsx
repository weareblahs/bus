import { useEffect } from "react";
import { RouteSelectionDropdown } from "./RouteSelectionDropdown";
import { downloadRoutes } from "../../functions/DownloadRouteList";
import Cookies from "js-cookie";
import { DataRefresh } from "./DataRefresh";
import { Header } from "./Header";

export const Home = () => {
  // checks if list of routes is downloaded. if not, then download. stored in localstorage
  useEffect(() => {
    async function get() {
      const data = await downloadRoutes(Cookies.get("provider"));
      localStorage.setItem("routeData", JSON.stringify(data));
    }

    if (!localStorage.getItem("routeData")) {
      get();
    }
  }, []);
  return (
    <div className="ps-8 pe-8 pt-6 pb-6">
      <Header />
      {localStorage.getItem("routeData") ? (
        <RouteSelectionDropdown />
      ) : (
        <DataRefresh />
      )}
    </div>
  );
};
