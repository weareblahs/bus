import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Provider } from "./retrieveAvailableProviders";

type State = {
  isFirstTime: boolean;
  providerName: string;
  realtimeUrl: string;
  id: string;
  debugLabs: boolean;
  setProvider: (provider: Provider) => void;
  clearProvider: () => void;
  setDebugLabs: () => void;
};

export const useVars = create<State>()(
  persist(
    (set) => {
      const state = {
        isFirstTime: true,
        providerName: "",
        realtimeUrl: "",
        id: "",
        debugLabs: false,
        setProvider: (provider: Provider) =>
          set({
            providerName: provider.name,
            realtimeUrl: provider.realtimeUrl,
            id: provider.id,
            // changes isFirstTime to false in order to make to run with selected data
            isFirstTime: false,
          }),
        clearProvider: () => {
          set({ isFirstTime: true });
        },
        setDebugLabs: () => {
          set((state) => ({ debugLabs: !state.debugLabs }));
        },
      };

      return state;
    },
    {
      name: "use-vars",
    },
  ),
);
