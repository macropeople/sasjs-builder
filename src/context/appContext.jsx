import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({
  masterJson: {
    sasJsConfig: {
      serverUrl: "http://sas.analytium.co.uk",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
    },
  },
  setMasterJson: (json) => {},
  isNewJson: false,
  setIsNewJson: (value) => {},
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState({
    sasJsConfig: {
      serverUrl: "http://sas.analytium.co.uk",
      appLoc: "/common/appInit",
      serverType: "SASVIYA",
    },
  });
  const [isNewJson, setIsNewJson] = useState(false);

  useEffect(() => {
    if (!!masterJson) {
      setIsNewJson(true);
    }
  }, [masterJson]);

  return (
    <AppContext.Provider
      value={{ masterJson, setMasterJson, isNewJson, setIsNewJson }}
    >
      {children}
    </AppContext.Provider>
  );
};
