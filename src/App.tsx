import "./App.css";
import { FirstTimeLaunch } from "./components/FirstTimeLanding";
import { useVars } from "./lib/state";
import { Home } from "./components/home/home";

function App() {
  // check if it's first-time launch
  const isFirstTime = useVars((state) => state.isFirstTime);

  return (
    <div className="p-5">{isFirstTime ? <FirstTimeLaunch /> : <Home />}</div>
  );
}

export default App;
