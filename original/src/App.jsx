import Cookies from "js-cookie";
import { Setup } from "./AppComponents/Setup";
import { Home } from "./AppComponents/Home";
const isSetup = Cookies.get("isSetUp");
function App() {
  if (isSetup) {
    return <Home />;
  } else {
    return <Setup />;
  }
}

export default App;
