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
    <div className="p-5 lg:ps-8 lg:pe-8 lg:pt-6 lg:pb-6">
      <Header />
      {localStorage.getItem("routeData") ? (
        <RouteSelectionDropdown />
      ) : (
        <DataRefresh />
      )}
    </div>
  );
};
