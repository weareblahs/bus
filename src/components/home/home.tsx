import { useVars } from "@/lib/state";
import { BqmMainInterface } from "./main-interface";
import { DebugLabs } from "../debug-labs";

export function Home() {
  const debugLabs = useVars((state) => state.debugLabs);
  return <>{debugLabs ? <DebugLabs /> : <BqmMainInterface />}</>;
}
