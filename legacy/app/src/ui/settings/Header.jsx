import Cookies from "js-cookie";
import { FaAngleLeft, FaGear } from "react-icons/fa6";
import { button } from "../../styling/Classnames";
import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="me-4">
        <Button className={button} onClick={() => navigate("/")}>
          {" "}
          <div className="flex">
            <h1 className="text-lg mt-auto mb-auto me-0 lg:me-4">
              <FaAngleLeft />
            </h1>
            <span className="text-medium mt-auto mb-auto hidden lg:block ">
              Back
            </span>
          </div>
        </Button>
      </div>
      <div className="mt-auto mb-auto">
        <h1 className="text-2xl">Settings</h1>
      </div>
    </div>
  );
};
