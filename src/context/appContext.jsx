import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({
  masterJson: {},
  setMasterJson: json => {},
  isNewJson: false,
  setIsNewJson: value => {}
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState({});
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
