import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { Home, Welcome, Auth, NewAccount } from "./pages";
import { ExtensionService } from "./services/Extension.service";
import "./App.css";
import Logo from "./assets/logo.png";
import { useShopConnect } from "./utils/hooks";
import theme from './utils/muiTheme';

function App() {
  const [inited, setInited] = useState(false);
  const [error, setError] = useState("");

  // Initialize ShopConnect
  useShopConnect();

  useEffect(() => {
    ExtensionService.getInstance()
      .then(() => setInited(true))
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {!inited && error && (
          <div>
            <h6>{error}</h6>
          </div>
        )}
        {inited && !error ? (
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/welcome"} element={<Welcome />} />
            <Route path={"/auth"} element={<Auth />} />
            <Route path={"/newAccount"} element={<NewAccount />} />
          </Routes>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={Logo} alt="Loading" className="w-20 h-20 animate-bounce" />
          </div>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
