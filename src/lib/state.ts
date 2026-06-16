import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Provider } from "./retrieveAvailableProviders";

type State = {
  isFirstTime: boolean;
  providerName: string;
  realtimeUrl: string;
  id: string;
  setProvider: (provider: Provider) => void;
};

export const useVars = create<State>()(
  persist(
    (set) => {
      const state = {
        isFirstTime: true,
        providerName: "",
        realtimeUrl: "",
        id: "",
        setProvider: (provider: Provider) =>
          set({
            providerName: provider.name,
            realtimeUrl: provider.realtimeUrl,
            id: provider.id,
            // changes isFirstTime to false in order to make to run with selected data
            isFirstTime: false,
          }),
      };

      return state;
    },
    {
      name: "use-vars",
    },
  ),
);
