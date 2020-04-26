import React, { useState, useEffect } from "react";
import { Header, Form, Icon, Tab } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceDetail.scss";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "./ContentEditable";
import PopupIcon from "./PopupIcon";
import produce from "immer";
import TryItOut from "./TryItOut";
import { useCallback } from "react";
import { useRef } from "react";
import HotServiceTable from "./HotServiceTable";

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
  const [currentRequestTableIndex, setCurrentRequestTableIndex] = useState(-1);
  const [currentResponseTableIndex, setCurrentResponseTableIndex] = useState(
    -1
  );
  const [description, setDescription] = useState("");
  const [requestTables, setRequestTables] = useState([]);
  const [responseTables, setResponseTables] = useState([]);
  const serviceNameRef = useRef();
  const requestTabRef = useRef();
  const responseTabRef = useRef();

  const addRequestTable = useCallback(() => {
    const newRequestTables = produce(requestTables, (draft) => {
      draft.push({
        tableName: `NewRequestTable${draft.length + 1}`,
        columns: [{ title: "column1", type: "numeric" }],
        data: { [`NewRequestTable${draft.length + 1}`]: [{ column1: "" }] },
      });
    });
    setRequestTables(newRequestTables);
    setCurrentRequestTableIndex(newRequestTables.length - 1);
    if (requestTabRef.current) {
      requestTabRef.current.render();
    }
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
        columns: [{ title: "column1", type: "numeric" }],
        data: { [`NewResponseTable${draft.length + 1}`]: [{ column1: "" }] },
      });
    });
    setResponseTables(newResponseTables);
    setCurrentResponseTableIndex(newResponseTables.length - 1);
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
        setCurrentRequestTableIndex(0);
      } else {
        setCurrentRequestTableIndex(-1);
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
        setCurrentResponseTableIndex(0);
      } else {
        setCurrentResponseTableIndex(-1);
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

  const updateResponseTable = useCallback(
    (updatedTable, index) => {
      const newResponseTables = produce(responseTables, (draft) => {
        draft[index] = updatedTable;
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

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setRequestTables(service.requestTables || []);
      setResponseTables(service.responseTables || []);
      if (service.requestTables && service.requestTables.length) {
        setCurrentRequestTableIndex(0);
      }
      if (service.responseTables && service.responseTables.length) {
        setCurrentResponseTableIndex(0);
      }
    }
  }, [service]);

  useEffect(() => {
    if (serviceNameRef.current) {
      serviceNameRef.current.focus();
      const timeout = setTimeout(() => {
        document.execCommand("selectAll", false, null);
        clearTimeout(timeout);
      });
    }
  }, [serviceNameRef]);

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
              if (value !== name) {
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
              if (description !== value) {
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
              }
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
              ref={requestTabRef}
              activeIndex={currentRequestTableIndex}
              onTabChange={(_, data) =>
                setCurrentRequestTableIndex(data.activeIndex)
              }
              panes={requestTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane inverted={isDarkMode} key={table.tableName}>
                      <div className="tables-header">
                        <Header inverted={isDarkMode} as="h3">
                          <ContentEditable
                            className="table-name-header h3"
                            html={`${table.tableName}`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerText;
                              if (value === table.tableName) {
                                return;
                              }
                              const tableNames = requestTables.map(
                                (t) => t.tableName
                              );
                              if (
                                tableNames.includes(value) &&
                                tableNames.indexOf(value) !== index
                              ) {
                                toast({
                                  type: "error",
                                  icon: "warning",
                                  title: "Table already exists",
                                  description: (
                                    <>
                                      A table with the name <b>{value}</b>{" "}
                                      already exists.
                                      <br />
                                      Please try again with a different table
                                      name.
                                    </>
                                  ),
                                  time: 2000,
                                });
                                e.target.innerText = table.tableName;
                                e.target.focus();
                                const timeout = setTimeout(() => {
                                  document.execCommand(
                                    "selectAll",
                                    false,
                                    null
                                  );
                                  clearTimeout(timeout);
                                });
                              } else {
                                updateRequestTableName(value, index);
                              }
                            }}
                          />
                        </Header>
                        <Icon
                          className="icon-button"
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRequestTable(table);
                          }}
                        />
                      </div>
                      <HotServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          updateRequestTable(
                            { ...updatedTable, tableName: table.tableName },
                            index
                          );
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
              ref={responseTabRef}
              activeIndex={currentResponseTableIndex}
              onTabChange={(_, data) =>
                setCurrentResponseTableIndex(data.activeIndex)
              }
              panes={responseTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane
                      inverted={isDarkMode}
                      key={table.tableName}
                      // active={
                      //   currentResponseTable &&
                      //   currentResponseTable.tableName === table.tableName
                      // }
                    >
                      <div className="tables-header">
                        <Header inverted={isDarkMode} as="h3">
                          <ContentEditable
                            className="table-name-header h3"
                            html={`${table.tableName}`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerText;
                              const tableNames = responseTables.map(
                                (t) => t.tableName
                              );
                              if (
                                tableNames.includes(value) &&
                                tableNames.indexOf(value) !== index
                              ) {
                                toast({
                                  type: "error",
                                  icon: "warning",
                                  title: "Table already exists",
                                  description: (
                                    <>
                                      A table with the name <b>{value}</b>{" "}
                                      already exists.
                                      <br />
                                      Please try again with a different table
                                      name.
                                    </>
                                  ),
                                  time: 2000,
                                });
                                e.target.innerText = table.tableName;
                                e.target.focus();
                                const timeout = setTimeout(() => {
                                  document.execCommand(
                                    "selectAll",
                                    false,
                                    null
                                  );
                                  clearTimeout(timeout);
                                });
                              } else {
                                updateResponseTableName(value, index);
                              }
                            }}
                          />
                        </Header>
                        <Icon
                          className="icon-button"
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeResponseTable(table);
                          }}
                        />
                      </div>
                      <HotServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          updateResponseTable(
                            { ...updatedTable, tableName: table.tableName },
                            index
                          );
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
