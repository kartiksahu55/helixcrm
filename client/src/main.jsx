import "./index.css";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Button, ConfigProvider, Space } from "antd";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { store } from "./store/store.js";
const theme = {
  token: {
    // Seed Token
    colorSecondary: "green",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={theme}> 
      <BrowserRouter>
        <App />
        <Toaster />
        <SpeedInsights/>
      </BrowserRouter>
    </ConfigProvider>
  </Provider>,
);
