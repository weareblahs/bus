import { Router, Route, Routes } from "react-router-dom";
import { ProviderSelection } from "./ui/setup/ProviderSelection";
import Cookies from "js-cookie";
import "./App.css";
import { Home } from "./ui/home/Home";
import { Settings } from "./ui/settings/Settings";
function App() {
  return (
    <div className="w-[100vw] h-[100vh] bg-white dark:bg-black text-black dark:text-white">
      <Routes>
        <Route
          path="/"
          element={Cookies.get("provider") ? <Home /> : <ProviderSelection />}
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
