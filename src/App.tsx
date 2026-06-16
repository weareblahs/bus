import "./App.css";
import { getGtfsData, type GTFSData } from "./scripts/getGtfsData";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const loadData = async () => {
      const data: GTFSData = await getGtfsData();
      console.log(data);
    };

    loadData();
  }, []);

  return <>{JSON.stringify}</>;
}

export default App;
