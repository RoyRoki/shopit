import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/index";
import RootRoutes from "./routes";
import { Provider } from "react-redux";
import store from "./store";
import './util/fontAwesomeLibrary';

function App() {
  return (
    <Provider store={store}>
      <ContextProvider>
        <BrowserRouter>
          <RootRoutes />
        </BrowserRouter>
      </ContextProvider>
    </Provider>

  );
}

export default App;
