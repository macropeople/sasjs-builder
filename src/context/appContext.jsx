import React, { createContext, useState, useEffect } from "react";

const json = {
  appConfig: {
    name: "Krishna Test",
    description: "Krishna Test SAS App",
    author: "Krishna"
  },
  sasJsConfig: {
    serverUrl: "http://sas.analytium.co.uk",
    port: 7980,
    pathSAS9: "/SASStoredProcess/do",
    pathSASViya: "/SASJobExecution",
    appLoc: "/Public/app",
    serverType: "SAS9",
    debug: false
  },
  folders: [
    {
      name: "common",
      services: [
        {
          name: "appInit",
          description: "My first Service Maker",
          response: {
            areas: [
              {
                area: "Adak"
              },
              {
                area: "Adel"
              }
            ]
          }
        },
        {
          name: "appInitTest2",
          description: "My first Service Maker",
          response: {
            areas: [
              {
                area: "Adak"
              },
              {
                area: "Adel"
              }
            ]
          }
        },
        {
          name: "appInitTest3",
          description: "My first Service Maker",
          response: {
            areas: [
              {
                area: "Adak"
              },
              {
                area: "Adel"
              }
            ]
          }
        },
        {
          name: "appInitTest4",
          description: "My first Service Maker",
          response: {
            areas: [
              {
                area: "Adak"
              },
              {
                area: "Adel"
              }
            ]
          }
        },
        {
          name: "appInitTest5",
          description: "My first Service Maker",
          response: {
            areas: [
              {
                area: "Adak"
              },
              {
                area: "Adel"
              }
            ]
          }
        },
        {
          name: "getData",
          description: "My Another Service Maker",
          request: {
            areas: [
              {
                area: "Adel"
              }
            ]
          },
          response: {
            springs: [
              {
                area: "Adak",
                s: "spring1",
                "-": "44"
              },
              {
                area: "Adel",
                s: "spring2",
                "-": "22"
              },
              {
                area: "blah",
                s: "sprin3",
                "-": "-3"
              }
            ]
          }
        }
      ]
    },
    {
      name: "admin",
      services: [
        {
          name: "createUser",
          description: "creating a new user (admin task)",
          response: {
            newuser: [
              {
                name: "Krishna",
                id: 42,
                I: "IE"
              }
            ]
          }
        },
        {
          name: "getData",
          description: "My Another Service Maker",
          request: {
            deleteuser: [
              {
                username: "johnny"
              }
            ]
          },
          response: {
            result: [
              {
                success: "true"
              }
            ]
          }
        }
      ]
    }
  ]
};

export const AppContext = createContext({
  masterJson: json,
  setMasterJson: json => {},
  isNewJson: false,
  setIsNewJson: value => {}
});

export const AppProvider = ({ children }) => {
  const [masterJson, setMasterJson] = useState(json);
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
