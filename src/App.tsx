import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useWeb3React } from "@web3-react/core";

import { injected } from "./wallet";
import Login from "./modules/Auth/Login";
import GameView from "./modules/App";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ReferralPage from "./modules/Referral";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  const renderApp = () => {
    if (loaded) {
      return networkActive ? <GameView /> : <Login />;
    }
  };

  const renderReferral = () => {
    if (loaded) {
      return networkActive ? <ReferralPage /> : <Login />;
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={renderApp()} />
        <Route path="ref/:address" element={renderReferral()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
