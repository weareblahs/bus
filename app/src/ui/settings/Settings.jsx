import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ChangeProvider } from "./ChangeProvider";
import { AppInformation } from "./AppInformation";
import { NearbyDisplayLanguage } from "./NearbyDisplayLanguage";

export const Settings = () => {
  return (
    <div className="ps-8 pe-8 pt-6 pb-6">
      <Header />
      {/* blocks for settings */}
      <ChangeProvider />
      <NearbyDisplayLanguage />
      <AppInformation />
    </div>
  );
};
