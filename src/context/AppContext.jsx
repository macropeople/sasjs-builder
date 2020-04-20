import React, { createContext, useState, useEffect } from "react";
import SASjs from "sasjs";
import { useCallback } from "react";

const defaultConfig = {
  appConfig: {
    name: "MySASjsApp",
    description: "My SASjs App",
  },
  sasJsConfig: {
    serverUrl: "",
    appLoc: "/Public/apps",
    serverType: "SASVIYA",
    debug: true,
  },
  folders: [
    {
      name: "common",
      services: [
        {
          name: "appInit",
          description:
            "This is my SASjs service description. Click me to edit!",
          requestTables: [],
          responseTables: [],
        },
      ],
    },
  ],
};

export const AppContext = createContext({
  masterJson: defaultConfig,
  setMasterJson: (json) => {},
  isLoggedIn: false,
  login: () => Promise.reject(),
  adapter: null,
  isDarkMode: false,
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState(defaultConfig);
  const [adapter, setAdapter] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedJson = localStorage.getItem("sasJsBuilderJson");
    let parsedJson, sasjs;
    if (storedJson) {
      parsedJson = JSON.parse(storedJson);
    }

    if (parsedJson && parsedJson.sasJsConfig) {
      debugger;
      sasjs = new SASjs(parsedJson.sasJsConfig);
    } else {
      debugger;
      sasjs = new SASjs(defaultConfig.sasJsConfig);
    }
    setAdapter(sasjs);
    const config = sasjs.getSasjsConfig();
    debugger;
    if (parsedJson) {
      setMasterJson({ ...parsedJson, sasJsConfig: config });
    } else {
      setMasterJson((m) => ({
        ...m,
        sasJsConfig: config,
      }));
    }
    sasjs.checkSession().then((response) => setIsLoggedIn(response.isLoggedIn));
  }, []);

  useEffect(() => {
    if (masterJson) {
      if (masterJson.sasJsConfig) {
        debugger;
        setAdapter(new SASjs(masterJson.sasJsConfig));
      }
      localStorage.setItem("sasJsBuilderJson", JSON.stringify(masterJson));
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
