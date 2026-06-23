import { useVars } from "@/lib/state";

import { DebugLabs } from "../debug-labs";
import { useState } from "react";
import { BqmMainInterface } from "../ui/main-interface";

export function Home() {
  const [currentView, setCurrentView] = useState<string>("home");
  const debugLabs = useVars((state) => state.debugLabs);
  return <>{debugLabs ? <DebugLabs /> : <BqmMainInterface />}</>;
}
