import { Button } from "@headlessui/react";
import Cookies from "js-cookie";
import { button } from "../../styling/Classnames";
import { useNavigate } from "react-router-dom";
export const ChangeProvider = () => {
  const redirect = useNavigate();
  return (
    <div className="grid lg:grid-cols-2 bg-gray-950 dark:bg-gray-900 p-5 m-5 rounded-2xl">
      <div>
        <h1 className="text-2xl text-white">Change bus provider</h1>
        <h1 className="text-medium text-white ">
          Change bus provider for this app. Currently set to{" "}
          {Cookies.get("provider")}. Use this option too, if you want to reset{" "}
          <i>bus?</i>.<br />
          <span className="font-bold text-red-600">
            ATTENTION: This will remove all your previously saved information,
            including favorite routes and history.
          </span>
        </h1>
      </div>
      <div className="ms-auto me-auto mt-2 mb-2 lg:mt-auto lg:mb-auto">
        <Button
          className={`${button} w-50 lg:w-100`}
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to continue? This will delete all previously saved information!"
              )
            ) {
              Cookies.remove("provider");
              redirect("/");
              window.location.reload();
              localStorage.clear("routeData");
            } else {
            }
          }}
        >
          Change provider
        </Button>
      </div>
    </div>
  );
};
