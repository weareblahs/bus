import { Providers } from "./Components/Providers";
import { ProviderSelectionFooter } from "./Components/ProviderSelectionFooter";
import { ProviderSelectionHeader } from "./Components/ProviderSelectionHeader";

export const ProviderSelection = () => {
  return (
    <div className="p-4 lg:p-8">
      <ProviderSelectionHeader />
      <Providers />{" "}
    </div>
  );
};
