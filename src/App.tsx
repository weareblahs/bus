import "./App.css";
import { useEffect } from "react";
import { getGtfsData, type GTFSData } from "./lib/getGtfsData";
import { FirstTimeLaunch } from "./components/FirstTimeLanding";
import { useVars } from "./lib/state";

function App() {
  // check if it's first-time launch
  const isFirstTime = useVars((state) => state.isFirstTime);
  const providerName = useVars((state) => state.providerName);
  useEffect(() => {
    const loadData = async () => {
      const data: GTFSData = await getGtfsData();
      console.log(data);
    };
    loadData();
  }, []);

  return isFirstTime ? <FirstTimeLaunch /> : providerName;
  // return <FirstTimeLaunch />;
}

export default App;
