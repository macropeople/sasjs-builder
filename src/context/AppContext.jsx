import React, { createContext, useState, useEffect } from "react";
import SASjs from "sasjs";
import { useCallback } from "react";

export const AppContext = createContext({
  masterJson: {
    sasJsConfig: {
      serverUrl: "http://sas.analytium.co.uk",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
    },
  },
  setMasterJson: (json) => {},
  isLoggedIn: false,
  login: () => Promise.reject(),
  adapter: null,
  isDarkMode: false,
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState({
    sasJsConfig: {
      serverUrl: "",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
      debug: true,
    },
  });
  const [adapter, setAdapter] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const sasjs = new SASjs({
      serverUrl: "",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
      debug: true,
    });
    setAdapter(sasjs);
    const config = sasjs.getSasjsConfig();
    // SASjs bug: serverUrl is set to location.hostname:<empty> when there is no port specified
    setMasterJson((m) => ({
      ...m,
      sasJsConfig: {
        ...m.sasJsConfig,
        pathSAS9: config.pathSAS9,
        pathSASViya: config.pathSASViya,
      },
    }));
    sasjs.checkSession().then((response) => setIsLoggedIn(response.isLoggedIn));
  }, []);

  useEffect(() => {
    if (masterJson && masterJson.sasJsConfig) {
      setAdapter(new SASjs(masterJson.sasJsConfig));
    }
  }, [masterJson]);

  const logIn = useCallback(
    (username, password) => {
      return adapter
        .logIn(username, password)
        .then((res) => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    },
    [adapter]
  );

  useEffect(() => {
    if (isDarkMode) {
      document.querySelector("body").classList.add("dark-mode");
    } else {
      document.querySelector("body").classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        masterJson,
        setMasterJson,
        adapter,
        isLoggedIn,
        logIn,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};