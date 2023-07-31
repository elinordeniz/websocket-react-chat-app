import axios from "axios";
import Routes from "./components/Routes";
import { MessageContextProvider } from "./context/MessageContext";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <MessageContextProvider>
      <Routes />
    </MessageContextProvider>
  );
}

export default App;

