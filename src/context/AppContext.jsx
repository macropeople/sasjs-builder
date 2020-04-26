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
    debug: false,
  },
  folders: [
    {
      name: "common",
      services: [
        {
          name: "appInit",
          description:
            "This is my SASjs service description. Click me to edit!",
          requestTables: [
            {
              tableName: "test",
              columns: [
                { title: "Person", type: "text" },
                { title: "Value", type: "numeric" },
              ],
              data: {
                test: [
                  { Person: "Krishna", Value: 42 },
                  { Person: "Allan", Value: 64 },
                ],
              },
            },
          ],
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
  const [isDataCleared, setIsDataCleared] = useState(false);

  useEffect(() => {
    const darkModeEnabled = JSON.parse(
      localStorage.getItem("sasJsBuilderDarkMode") || "false"
    );
    setIsDarkMode(darkModeEnabled);
    const storedJson = localStorage.getItem("sasJsBuilderJson");
    let parsedJson, sasjs;
    if (storedJson) {
      parsedJson = JSON.parse(storedJson);
    }

    if (parsedJson && parsedJson.sasJsConfig) {
      sasjs = new SASjs(parsedJson.sasJsConfig);
    } else {
      sasjs = new SASjs(defaultConfig.sasJsConfig);
    }
    setAdapter(sasjs);
    const config = sasjs.getSasjsConfig();
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

  const logOut = useCallback(() => {
    return adapter.logOut().then((res) => setIsLoggedIn(false));
  }, [adapter]);

  const clearStoredData = useCallback(() => {
    const storedJson = localStorage.getItem("sasJsBuilderJson");
    let parsedJson;
    if (storedJson) {
      parsedJson = JSON.parse(storedJson);
    }
    parsedJson.folders = [];
    setMasterJson({ ...masterJson, folders: [] });
    setIsDataCleared(true);

    localStorage.setItem("sasJsBuilderJson", JSON.stringify(parsedJson));
  }, [masterJson]);

  useEffect(() => {
    localStorage.setItem("sasJsBuilderDarkMode", isDarkMode);
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
        logOut,
        isDarkMode,
        setIsDarkMode,
        clearStoredData,
        isDataCleared,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
