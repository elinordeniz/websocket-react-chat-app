import axios from "axios";
import { UserContextProvider } from "./context/UserContext";
import Routes from "./components/Routes";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
