import React, { createContext, useState, useEffect } from "react";
import SASjs from "sasjs";

export const AppContext = createContext({
  masterJson: {
    sasJsConfig: {
      serverUrl: "http://sas.analytium.co.uk",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
    },
  },
  setMasterJson: (json) => {},
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState({
    sasJsConfig: {
      serverUrl: "",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
    },
  });
  const [adapter, setAdapter] = useState(null);

  useEffect(() => {
    setAdapter(
      new SASjs({
        serverUrl: "",
        appLoc: "/common/appInit",
        serverType: "SASVIYA",
      })
    );
  }, []);

  useEffect(() => {
    if (masterJson && masterJson.sasJsConfig) {
      setAdapter(new SASjs(masterJson.sasJsConfig));
    }
  }, [masterJson]);

  return (
    <AppContext.Provider value={{ masterJson, setMasterJson, adapter }}>
      {children}
    </AppContext.Provider>
  );
};
