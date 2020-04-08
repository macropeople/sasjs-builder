import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  Header,
  Form,
  Icon,
  Popup,
  Accordion,
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceModal.scss";
import ServiceTable from "./ServiceTable";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "react-contenteditable";

const ServiceModal = ({ service, path, onClose, onUpdate }) => {
  const [name, setName] = useState(service ? service.name : "");
  const [currentRequestTable, setCurrentRequestTable] = useState(null);
  const [currentResponseTable, setCurrentResponseTable] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [requestTables, setRequestTables] = useState([]);
  const [responseTables, setResponseTables] = useState([]);

  useEffect(() => {
    if (service) {
      setIsOpen(true);
      if (service.requestTables && service.requestTables.length) {
        setCurrentRequestTable(service.requestTables[0]);
      } else if (service.responseTables && service.responseTables.length) {
        setCurrentResponseTable(service.responseTables[0]);
      }
    }
  }, [service]);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setRequestTables(service.requestTables || []);
      setResponseTables(service.responseTables || []);
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
      size="large"
      closeIcon
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      <Header icon="server" content={name} />
      <div className="service-modal-inner-container">
        <Form className="service-form">
          <Form.Group>
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
          </Form.Group>
          <Header as="h3" className="tables-header">
            Request Tables
            <Popup
              inverted
              content="Add request table"
              trigger={
                <Icon
                  name="add circle"
                  className="icon-button"
                  color="blue"
                  onClick={() => {
                    const currentRequestTables = [...requestTables];
                    currentRequestTables.push({
                      tableName: `NewRequestTable${
                        currentRequestTables.length + 1
                      }`,
                      columns: [{ name: "column1", numeric: false }],
                      rows: [{ column1: "" }],
                    });
                    setRequestTables(currentRequestTables);
                  }}
                />
              }
            />
          </Header>
          {!!requestTables.length && (
            <Accordion>
              {requestTables.map((table, index) => {
                return (
                  <div key={table.tableName}>
                    <Accordion.Title
                      active={
                        currentRequestTable &&
                        currentRequestTable.name === table.name
                      }
                      onClick={() =>
                        currentRequestTable
                          ? setCurrentRequestTable(null)
                          : setCurrentRequestTable(table)
                      }
                    >
                      <Icon name="dropdown" />
                      <ContentEditable
                        className="table-name-header"
                        html={`<h3 class="table-name-header">${table.tableName}</h3>`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={false}
                        onBlur={(e) => {
                          const value = e.target.innerHTML
                            .replace(`<h3 class="table-name-header">`, "")
                            .replace("</h3>", "");
                          const newRequestTables = [...requestTables];
                          newRequestTables[index].tableName = value;
                          setRequestTables(newRequestTables);
                        }}
                      />
                      <Icon
                        name="trash alternate outline"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedTables = [
                            ...requestTables.filter(
                              (t) => t.tableName !== table.tableName
                            ),
                          ];
                          setRequestTables(updatedTables);
                          toast({
                            type: "info",
                            icon: "trash alternate outline",
                            title: "Table Removed",
                            description: `Table ${table.tableName} has now been removed.`,
                            time: 2000,
                          });
                        }}
                      />
                    </Accordion.Title>
                    <Accordion.Content
                      active={
                        currentRequestTable &&
                        currentRequestTable.name === table.name
                      }
                    >
                      <ServiceTable
                        table={table}
                        onUpdate={(updatedTable) => {
                          const currentRequestTables = [...requestTables];
                          currentRequestTables[index] = updatedTable;
                          setRequestTables(currentRequestTables);
                        }}
                      />
                    </Accordion.Content>
                  </div>
                );
              })}
            </Accordion>
          )}
          <Header as="h3" className="tables-header">
            Response Tables
            <Popup
              inverted
              content="Add response table"
              trigger={
                <Icon
                  name="add circle"
                  className="icon-button"
                  color="blue"
                  onClick={() => {
                    const currentResponseTables = [...responseTables];
                    currentResponseTables.push({
                      tableName: `NewResponseTable${
                        currentResponseTables.length + 1
                      }`,
                      columns: [{ name: "column1", numeric: false }],
                      rows: [{ column1: "" }],
                    });
                    setResponseTables(currentResponseTables);
                  }}
                />
              }
            />
          </Header>
          {!!responseTables.length && (
            <Accordion>
              {responseTables.map((table, index) => {
                return (
                  <div key={index}>
                    <Accordion.Title
                      active={
                        currentResponseTable &&
                        currentResponseTable.name === table.name
                      }
                      onClick={() => {
                        currentResponseTable
                          ? setCurrentResponseTable(null)
                          : setCurrentResponseTable(table);
                      }}
                    >
                      <Icon name="dropdown" />
                      <ContentEditable
                        className="table-name-header"
                        html={`<h3 class="table-name-header">${table.tableName}</h3>`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={false}
                        onBlur={(e) => {
                          const value = e.target.innerHTML
                            .replace(`<h3 class="table-name-header">`, "")
                            .replace("</h3>", "");
                          const newResponseTables = [...responseTables];
                          newResponseTables[index].tableName = value;
                          setResponseTables(newResponseTables);
                        }}
                      />
                      <Icon
                        name="trash alternate outline"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedTables = [
                            ...responseTables.filter(
                              (t) => t.tableName !== table.tableName
                            ),
                          ];
                          setResponseTables(updatedTables);
                          toast({
                            type: "info",
                            icon: "trash alternate outline",
                            title: "Table Removed",
                            description: `Table ${table.tableName} has now been removed.`,
                            time: 2000,
                          });
                        }}
                      />
                    </Accordion.Title>
                    <Accordion.Content
                      active={
                        currentResponseTable &&
                        currentResponseTable.name === table.name
                      }
                    >
                      <ServiceTable
                        table={table}
                        onUpdate={(updatedTable) => {
                          const currentResponseTables = [...responseTables];
                          currentResponseTables[index] = updatedTable;
                          setResponseTables(currentResponseTables);
                        }}
                      />
                    </Accordion.Content>
                  </div>
                );
              })}
            </Accordion>
          )}
        </Form>
        {!!service && (
          <CodeSnippet
            path={path}
            serviceName={service.name}
            requestTables={requestTables}
            responseTables={responseTables}
          />
        )}
      </div>
    </Modal>
  ) : (
    <></>
  );
};

export default ServiceModal;
