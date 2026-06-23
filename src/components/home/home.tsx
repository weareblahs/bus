import { useVars } from "@/lib/state";

import { DebugLabs } from "../debug-labs";
import { useState } from "react";
import { BqmMainInterface } from "../ui/main-interface";
import { Options } from "../ui/options";

export function Home() {
  const [currentView, setCurrentView] = useState<string>("home");
  const debugLabs = useVars((state) => state.debugLabs);
  if (debugLabs) {
    return <DebugLabs />;
  } else {
    switch (currentView) {
      case "home":
        return <BqmMainInterface setCurrentView={setCurrentView} />;
      case "options":
        return <Options setCurrentView={setCurrentView} />;
    }
  }
}
