import { Button } from "@headlessui/react";
import Cookies from "js-cookie";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { button } from "../../styling/Classnames";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2">
      <div className="mt-auto mb-auto">
        <h1 className="text-2xl">{Cookies.get("provider")}</h1>
      </div>
      <div
        className="mt-auto mb-auto ms-auto me-2 text-2xl flex cursor-pointer"
        onClick={() => navigate("/settings")}
      >
        {/* settings page */}
        <Button className={button}>
          <FaGear className="mt-auto mb-auto text-xl" />{" "}
          <div className="mt-auto mb-auto ms-2 text-medium hidden lg:flex">
            Settings
          </div>
        </Button>
      </div>
    </div>
  );
};
