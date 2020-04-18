import React, { useState, useEffect } from "react";
import { Input, Header, Form, Icon, Tab } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceDetail.scss";
import ServiceTable from "./ServiceTable";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "react-contenteditable";
import PopupIcon from "./PopupIcon";
import produce from "immer";
import TryItOut from "./TryItOut";
import { useCallback } from "react";

const ServiceDetail = ({ service, path, onUpdate }) => {
  const [name, setName] = useState(service.name);
  const [currentRequestTable, setCurrentRequestTable] = useState(null);
  const [currentResponseTable, setCurrentResponseTable] = useState(null);
  const [description, setDescription] = useState(service.description);
  const [requestTables, setRequestTables] = useState([]);
  const [responseTables, setResponseTables] = useState([]);

  const addRequestTable = useCallback(() => {
    const newRequestTables = produce(requestTables, (draft) => {
      draft.push({
        tableName: `NewRequestTable${draft.length + 1}`,
        columns: [{ name: "column1", numeric: false }],
        rows: [{ column1: "" }],
      });
    });
    setRequestTables(newRequestTables);
    setCurrentRequestTable(newRequestTables[newRequestTables.length - 1]);
  }, [requestTables]);

  const addResponseTable = useCallback(() => {
    const newResponseTables = produce(responseTables, (draft) => {
      draft.push({
        tableName: `NewResponseTable${draft.length + 1}`,
        columns: [{ name: "column1", numeric: false }],
        rows: [{ column1: "" }],
      });
    });
    setResponseTables(newResponseTables);
    setCurrentResponseTable(newResponseTables[newResponseTables.length - 1]);
  }, [responseTables]);

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
    },
    [requestTables]
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
    },
    [responseTables]
  );

  const updateResponseTableName = useCallback(
    (value, index) => {
      const newResponseTables = produce(responseTables, (draft) => {
        draft[index].tableName = value;
      });
      setResponseTables(newResponseTables);
    },
    [responseTables]
  );

  const updateRequestTableName = useCallback(
    (value, index) => {
      const newRequestTables = produce(requestTables, (draft) => {
        draft[index].tableName = value;
      });
      setRequestTables(newRequestTables);
    },
    [requestTables]
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
    },
    [requestTables, currentRequestTable]
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
    },
    [responseTables, currentResponseTable]
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
    const serviceObject = {
      name,
      description,
      requestTables,
      responseTables,
    };
    onUpdate(serviceObject);
    toast({
      type: "info",
      icon: "save",
      title: "Service updated",
      description: `Service ${name} has now been updated.`,
      time: 2000,
    });
    // eslint-disable-next-line
  }, [requestTables, responseTables, description, name]);

  return service ? (
    <>
      <Header className="service-header">
        <Icon name="server" />
        <ContentEditable
          html={`<h1 class="table-name-header">${name}</h1>`}
          onClick={(e) => e.stopPropagation()}
          disabled={false}
          onBlur={(e) => {
            const value = e.target.innerHTML
              .replace(`<h1 class="table-name-header">`, "")
              .replace("</h1>", "");
            setName(value);
          }}
        />
      </Header>
      <div className="service-modal-inner-container">
        <Form className="service-form">
          <Form.Field
            control={Input}
            type="text"
            defaultValue={description}
            label="Service Description"
            placeholder="Service Description"
            onBlur={(e) => setDescription(e.target.value)}
          />
          <div className="tables-header">
            <Header as="h3">Request Tables</Header>
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
              }}
              panes={requestTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane
                      key={table.tableName}
                      active={
                        currentRequestTable &&
                        currentRequestTable.name === table.name
                      }
                    >
                      <div className="tables-header">
                        <Header
                          as="h3"
                          onClick={() =>
                            currentRequestTable
                              ? setCurrentRequestTable(null)
                              : setCurrentRequestTable(table)
                          }
                        >
                          <ContentEditable
                            html={`<h3 class="table-name-header">${table.tableName}</h3>`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerHTML
                                .replace(`<h3 class="table-name-header">`, "")
                                .replace("</h3>", "");
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
            <Header as="h3">Response Tables</Header>
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
              }}
              panes={responseTables.map((table, index) => {
                return {
                  menuItem: table.tableName,
                  render: () => (
                    <Tab.Pane
                      key={index}
                      active={
                        currentResponseTable &&
                        currentResponseTable.name === table.name
                      }
                    >
                      <div className="tables-header">
                        <Header
                          as="h3"
                          className="tables-header"
                          onClick={() => {
                            currentResponseTable
                              ? setCurrentResponseTable(null)
                              : setCurrentResponseTable(table);
                          }}
                        >
                          <ContentEditable
                            className="table-name-header"
                            html={`<h3 class="table-name-header">${table.tableName}</h3>`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerHTML
                                .replace(`<h3 class="table-name-header">`, "")
                                .replace("</h3>", "");
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
              path={path}
              serviceName={service.name}
              requestTables={requestTables}
              responseTables={responseTables}
            />
            <TryItOut
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
