import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { SetupStep1 } from "./setup/SetupStep1";
import { Home } from "./AppComponents/Home";
const isSetup = Cookies.get("isSetUp");
function App() {
  if (isSetup) {
    return <Home />;
  } else {
    return <SetupStep1 />;
  }
}

export default App;
