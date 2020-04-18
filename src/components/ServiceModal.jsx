import React, { useState, useEffect } from "react";
import { Input, Modal, Header, Form, Icon, Tab } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceModal.scss";
import ServiceTable from "./ServiceTable";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "react-contenteditable";
import PopupIcon from "./PopupIcon";
import produce from "immer";
import TryItOut from "./TryItOut";

const ServiceModal = ({ service, path, onClose, onUpdate }) => {
  const [name, setName] = useState(service.name);
  const [currentRequestTable, setCurrentRequestTable] = useState(null);
  const [currentResponseTable, setCurrentResponseTable] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(service.description);
  const [requestTables, setRequestTables] = useState([]);
  const [responseTables, setResponseTables] = useState([]);

  useEffect(() => {
    if (service) {
      setIsOpen(true);
      if (service) {
        setName(service.name);
        setDescription(service.description);
        setRequestTables(service.requestTables || []);
        setResponseTables(service.responseTables || []);
      }
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
    <Modal
      open={isOpen}
      size="fullscreen"
      closeIcon
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      <Header icon="server" content={name} />
      <div className="service-modal-inner-container">
        <Form className="service-form">
          <Form.Field
            control={Input}
            type="text"
            label="Service Name"
            defaultValue={name}
            placeholder="Service Name"
            onBlur={(e) => setName(e.target.value)}
          />
          <Form.Field
            control={Input}
            type="text"
            defaultValue={description}
            label="Service Description"
            placeholder="Service Description"
            onBlur={(e) => setDescription(e.target.value)}
          />
          <Header as="h3" className="tables-header">
            Request Tables
            <PopupIcon
              text="Add request table"
              icon="add circle"
              color="blue"
              onClick={() => {
                const newRequestTables = produce(requestTables, (draft) => {
                  draft.push({
                    tableName: `NewRequestTable${draft.length + 1}`,
                    columns: [{ name: "column1", numeric: false }],
                    rows: [{ column1: "" }],
                  });
                });
                setRequestTables(newRequestTables);
                setCurrentRequestTable(
                  newRequestTables[newRequestTables.length - 1]
                );
              }}
            />
          </Header>
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
                      <Header
                        as="h3"
                        className="tables-header"
                        onClick={() =>
                          currentRequestTable
                            ? setCurrentRequestTable(null)
                            : setCurrentRequestTable(table)
                        }
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
                            const newRequestTables = produce(
                              requestTables,
                              (draft) => {
                                draft[index].tableName = value;
                              }
                            );
                            setRequestTables(newRequestTables);
                          }}
                        />
                        <Icon
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newRequestTables = produce(
                              requestTables,
                              (draft) => {
                                draft = draft.filter(
                                  (t) => t.tableName !== table.tableName
                                );
                              }
                            );

                            setRequestTables(newRequestTables);

                            toast({
                              type: "info",
                              icon: "trash alternate outline",
                              title: "Table Removed",
                              description: `Table ${table.tableName} has now been removed.`,
                              time: 2000,
                            });
                          }}
                        />
                      </Header>
                      <ServiceTable
                        table={table}
                        onUpdate={(updatedTable) => {
                          const newRequestTables = produce(
                            requestTables,
                            (draft) => {
                              draft[index] = updatedTable;
                            }
                          );
                          setRequestTables(newRequestTables);
                        }}
                      />
                    </Tab.Pane>
                  ),
                };
              })}
            ></Tab>
          )}
          <Header as="h3" className="tables-header">
            Response Tables
            <PopupIcon
              text="Add response table"
              icon="add circle"
              color="blue"
              onClick={() => {
                const newResponseTables = produce(responseTables, (draft) => {
                  draft.push({
                    tableName: `NewResponseTable${draft.length + 1}`,
                    columns: [{ name: "column1", numeric: false }],
                    rows: [{ column1: "" }],
                  });
                });

                setResponseTables(newResponseTables);
                setCurrentResponseTable(
                  newResponseTables[newResponseTables.length - 1]
                );
              }}
            />
          </Header>
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
                            const newResponseTables = produce(
                              responseTables,
                              (draft) => {
                                draft[index].tableName = value;
                              }
                            );
                            setResponseTables(newResponseTables);
                          }}
                        />
                        <Icon
                          name="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newResponseTables = produce(
                              responseTables,
                              (draft) => {
                                draft.filter(
                                  (t) => t.tableName !== table.tableName
                                );
                              }
                            );
                            setResponseTables(newResponseTables);
                            toast({
                              type: "info",
                              icon: "trash alternate outline",
                              title: "Table Removed",
                              description: `Table ${table.tableName} has now been removed.`,
                              time: 2000,
                            });
                          }}
                        />
                      </Header>
                      <ServiceTable
                        table={table}
                        onUpdate={(updatedTable) => {
                          const newResponseTables = produce(
                            responseTables,
                            (draft) => {
                              draft[index] = updatedTable;
                            }
                          );
                          setResponseTables(newResponseTables);
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
    </Modal>
  ) : (
    <></>
  );
};

export default ServiceModal;
