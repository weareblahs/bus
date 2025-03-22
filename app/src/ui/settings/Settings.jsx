import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ChangeProvider } from "./ChangeProvider";
import { AppInformation } from "./AppInformation";
import { NearbyDisplayLanguage } from "./NearbyDisplayLanguage";

export const Settings = () => {
  return (
    <div className=" p-5 lg:ps-8 lg:pe-8 lg:pt-6 lg:pb-6">
      <Header />
      {/* blocks for settings */}
      <ChangeProvider />
      <NearbyDisplayLanguage />
      <AppInformation />
    </div>
  );
};
