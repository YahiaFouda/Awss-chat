import React from "react";
import ReactDOM from "react-dom/client";
import store from "../src/redux/Store";
import { Provider } from "react-redux";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
  </Provider>
);
// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import store from "../src/redux/Store";
// import { Provider } from "react-redux";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";
// import { BrowserRouter } from "react-router-dom";
// import "./style.scss";

// const persistor = persistStore(store);

// ReactDOM.render(
//   <BrowserRouter>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <App />
//       </PersistGate>
//     </Provider>
//   </BrowserRouter>,
//   document.getElementById("root")
// );
