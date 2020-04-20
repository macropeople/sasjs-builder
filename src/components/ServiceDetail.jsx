import React, { useState, useEffect } from "react";
import { Header, Form, Icon, Tab } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceDetail.scss";
import ServiceTable from "./ServiceTable";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "./ContentEditable";
import PopupIcon from "./PopupIcon";
import produce from "immer";
import TryItOut from "./TryItOut";
import { useCallback } from "react";
import { useRef } from "react";

const notifyUpdate = (serviceObject, onUpdate) => {
  onUpdate(serviceObject);
  toast({
    type: "info",
    icon: "save",
    title: "Service updated",
    description: `Service ${serviceObject.name} has now been updated.`,
    time: 2000,
  });
};

const ServiceDetail = ({
  service,
  path,
  onUpdate,
  validateServiceName,
  isDarkMode,
}) => {
  const [name, setName] = useState("");
  const [currentRequestTable, setCurrentRequestTable] = useState(null);
  const [currentResponseTable, setCurrentResponseTable] = useState(null);
  const [description, setDescription] = useState("");
  const [requestTables, setRequestTables] = useState([]);
  const [responseTables, setResponseTables] = useState([]);
  const serviceNameRef = useRef();

  const addRequestTable = useCallback(() => {
    const newRequestTables = produce(requestTables, (draft) => {
      draft.push({
        tableName: `NewRequestTable${draft.length + 1}`,
        columns: [{ name: "column1", numeric: true }],
        rows: [{ column1: "" }],
      });
    });
    setRequestTables(newRequestTables);
    setCurrentRequestTable(newRequestTables[newRequestTables.length - 1]);
    const serviceObject = {
      name,
      description,
      requestTables: newRequestTables,
      responseTables,
    };
    notifyUpdate(serviceObject, onUpdate);
  }, [requestTables, responseTables, name, description, onUpdate]);

  const addResponseTable = useCallback(() => {
    const newResponseTables = produce(responseTables, (draft) => {
      draft.push({
        tableName: `NewResponseTable${draft.length + 1}`,
        columns: [{ name: "column1", numeric: true }],
        rows: [{ column1: "" }],
      });
    });
    setResponseTables(newResponseTables);
    setCurrentResponseTable(newResponseTables[newResponseTables.length - 1]);
    const serviceObject = {
      name,
      description,
      requestTables,
      responseTables: newResponseTables,
    };
    notifyUpdate(serviceObject, onUpdate);
  }, [requestTables, responseTables, name, description, onUpdate]);

  const removeRequestTable = useCallback(
    (table) => {
      const newRequestTables = produce(requestTables, (draft) => {
        return draft.filter((t) => t.tableName !== table.tableName);
      });

      setRequestTables(newRequestTables);
      if (newRequestTables.length) {
        setCurrentRequestTable(newRequestTables[0]);
      } else {
        setCurrentRequestTable(null);
      }

      toast({
        type: "info",
        icon: "trash alternate outline",
        title: "Table Removed",
        description: `Table ${table.tableName} has now been removed.`,
        time: 2000,
      });
      const serviceObject = {
        name,
        description,
        requestTables: newRequestTables,
        responseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [requestTables, responseTables, name, description, onUpdate]
  );

  const removeResponseTable = useCallback(
    (table) => {
      const newResponseTables = produce(responseTables, (draft) => {
        return draft.filter((t) => t.tableName !== table.tableName);
      });

      setResponseTables(newResponseTables);
      if (newResponseTables.length) {
        setCurrentResponseTable(newResponseTables[0]);
      } else {
        setCurrentResponseTable(null);
      }

      toast({
        type: "info",
        icon: "trash alternate outline",
        title: "Table Removed",
        description: `Table ${table.tableName} has now been removed.`,
        time: 2000,
      });
      const serviceObject = {
        name,
        description,
        requestTables,
        responseTables: newResponseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [requestTables, responseTables, name, description, onUpdate]
  );

  const updateResponseTableName = useCallback(
    (value, index) => {
      const newResponseTables = produce(responseTables, (draft) => {
        draft[index].tableName = value;
      });
      setResponseTables(newResponseTables);
      const serviceObject = {
        name,
        description,
        requestTables,
        responseTables: newResponseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [requestTables, responseTables, name, description, onUpdate]
  );

  const updateRequestTableName = useCallback(
    (value, index) => {
      const newRequestTables = produce(requestTables, (draft) => {
        draft[index].tableName = value;
      });
      setRequestTables(newRequestTables);
      const serviceObject = {
        name,
        description,
        requestTables: newRequestTables,
        responseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [requestTables, responseTables, name, description, onUpdate]
  );

  const updateRequestTable = useCallback(
    (updatedTable, index) => {
      const newRequestTables = produce(requestTables, (draft) => {
        draft[index] = updatedTable;
      });
      setRequestTables(newRequestTables);
      if (
        currentRequestTable &&
        currentRequestTable.name === updatedTable.name
      ) {
        setCurrentRequestTable(updatedTable);
      }
      const serviceObject = {
        name,
        description,
        requestTables: newRequestTables,
        responseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [
      currentRequestTable,
      requestTables,
      responseTables,
      name,
      description,
      onUpdate,
    ]
  );

  const updateResponseTable = useCallback(
    (updatedTable, index) => {
      const newResponseTables = produce(responseTables, (draft) => {
        draft[index] = updatedTable;
      });
      setResponseTables(newResponseTables);
      if (
        currentResponseTable &&
        currentResponseTable.name === updatedTable.name
      ) {
        setCurrentResponseTable(updatedTable);
      }
      const serviceObject = {
        name,
        description,
        requestTables,
        responseTables: newResponseTables,
      };
      notifyUpdate(serviceObject, onUpdate);
    },
    [
      requestTables,
      responseTables,
      currentResponseTable,
      name,
      description,
      onUpdate,
    ]
  );

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setRequestTables(service.requestTables || []);
      setResponseTables(service.responseTables || []);
      if (service.requestTables && service.requestTables.length) {
        setCurrentRequestTable(service.requestTables[0]);
      } else if (service.responseTables && service.responseTables.length) {
        setCurrentResponseTable(service.responseTables[0]);
      }
    }
  }, [service]);

  useEffect(() => {
    if (serviceNameRef.current) {
      serviceNameRef.current.focus();
    }
  }, [serviceNameRef.current]);

  return service ? (
    <>
      <Header className="service-header" inverted={isDarkMode}>
        <Icon name="server" />
        <div className="fields">
          <ContentEditable
            className="service-name-field"
            html={`${name}`}
            innerRef={serviceNameRef}
            onClick={(e) => e.stopPropagation()}
            disabled={false}
            onBlur={(e) => {
              e.stopPropagation();
              const value = e.target.innerText;
              if (validateServiceName(value)) {
                setName(value);
                notifyUpdate(
                  {
                    name: value,
                    description,
                    requestTables,
                    responseTables,
                  },
                  onUpdate
                );
              } else {
                e.preventDefault();
                e.returnValue = false;
                setName(name);
                e.target.innerText = name;
                toast({
                  type: "error",
                  icon: "server",
                  title: "A service with that name already exists",
                  description: `Please try again with a different name`,
                  time: 2000,
                });
              }
            }}
          />
          <ContentEditable
            className="service-description-field"
            maxLength={255}
            allowSpaces={true}
            html={`${description}`}
            onClick={(e) => e.stopPropagation()}
            disabled={false}
            onBlur={(e) => {
              const value = e.target.innerText;
              setDescription(value);
              notifyUpdate(
                {
                  name,
                  description: value,
                  requestTables,
                  responseTables,
                },
                onUpdate
              );
            }}
          />
        </div>
      </Header>
      <div className="service-modal-inner-container">
        <Form className="service-form" inverted={isDarkMode}>
          <div className="tables-header">
            <Header as="h3" inverted={isDarkMode}>
              Request Tables
            </Header>
            <PopupIcon
              text="Add request table"
              icon="add circle"
              color="blue"
              onClick={addRequestTable}
            />
          </div>
          {!!requestTables.length && (
            <Tab
              menu={{
                tabular: true,
                fluid: true,
                inverted: isDarkMode,
              }}
              panes={requestTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane
                      inverted={isDarkMode}
                      key={table.tableName}
                      active={
                        currentRequestTable &&
                        currentRequestTable.name === table.name
                      }
                    >
                      <div className="tables-header">
                        <Header
                          inverted={isDarkMode}
                          as="h3"
                          onClick={() =>
                            currentRequestTable
                              ? setCurrentRequestTable(null)
                              : setCurrentRequestTable(table)
                          }
                        >
                          <ContentEditable
                            className="table-name-header h3"
                            html={`${table.tableName}`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerText;
                              updateRequestTableName(value, index);
                            }}
                          />
                        </Header>
                        <Icon
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRequestTable(table);
                          }}
                        />
                      </div>
                      <ServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          updateRequestTable(updatedTable, index);
                        }}
                      />
                    </Tab.Pane>
                  ),
                };
              })}
            ></Tab>
          )}
          <div className="tables-header">
            <Header as="h3" inverted={isDarkMode}>
              Response Tables
            </Header>
            <PopupIcon
              text="Add response table"
              icon="add circle"
              color="blue"
              onClick={addResponseTable}
            />
          </div>
          {!!responseTables.length && (
            <Tab
              menu={{
                tabular: true,
                fluid: true,
                inverted: isDarkMode,
              }}
              panes={responseTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane
                      inverted={isDarkMode}
                      key={index}
                      active={
                        currentResponseTable &&
                        currentResponseTable.name === table.name
                      }
                    >
                      <div className="tables-header">
                        <Header
                          as="h3"
                          inverted={isDarkMode}
                          className="tables-header"
                          onClick={() => {
                            currentResponseTable
                              ? setCurrentResponseTable(null)
                              : setCurrentResponseTable(table);
                          }}
                        >
                          <ContentEditable
                            className="table-name-header h3"
                            html={`${table.tableName}`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerText;
                              updateResponseTableName(value, index);
                            }}
                          />
                        </Header>
                        <Icon
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeResponseTable(table);
                          }}
                        />
                      </div>
                      <ServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          updateResponseTable(updatedTable, index);
                        }}
                      />
                    </Tab.Pane>
                  ),
                };
              })}
            ></Tab>
          )}
        </Form>
        {!!service && (
          <div className="code">
            <CodeSnippet
              isDarkMode={isDarkMode}
              path={path}
              serviceName={service.name}
              requestTables={requestTables}
              responseTables={responseTables}
            />
            <TryItOut
              isDarkMode={isDarkMode}
              path={path}
              serviceName={service.name}
              requestTables={requestTables}
              responseTables={responseTables}
            />
          </div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
};

export default ServiceDetail;
