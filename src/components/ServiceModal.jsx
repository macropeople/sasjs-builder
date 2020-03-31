import React, { useState, useEffect } from "react";
import { Input, Modal, Header, Form, Icon, Popup } from "semantic-ui-react";
import "./ServiceModal.scss";
import ServiceTable from "./ServiceTable";

const ServiceModal = ({ service, onClose }) => {
  const [name, setName] = useState(service ? service.name : "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (service) {
      setIsOpen(true);
    }
  }, [service]);

  const [description, setDescription] = useState(
    service ? service.description : ""
  );
  const [requestTables, setRequestTables] = useState(
    service && service.request ? service.request : []
  );
  const [responseTables, setResponseTables] = useState(
    service && service.response ? service.response : []
  );

  useEffect(() => {
    if (service) {
      setName(service.name);
      setRequestTables(service.request || []);
      setResponseTables(service.response || []);
    }
  }, [service]);
  return service ? (
    <Modal
      open={isOpen}
      size="large"
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      <Header icon="server" content={name} />
      <Form className="service-form">
        <Form.Group>
          <Form.Field
            control={Input}
            type="text"
            label="Service Name"
            defaultValue={name}
            placeholder="Service Name"
            onChange={e => setName(e.target.value)}
          />
          <Form.Field
            control={Input}
            type="text"
            defaultValue={description}
            label="Service Description"
            placeholder="Service Description"
            onChange={e => setDescription(e.target.value)}
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
                  debugger;
                  const currentRequestTables = [...requestTables];
                  currentRequestTables.push({
                    tableName: `NewRequestTable${currentRequestTables.length +
                      1}`,
                    columns: [{ name: "column1", numeric: false }],
                    rows: [{ column1: "" }]
                  });
                  setRequestTables(currentRequestTables);
                }}
              />
            }
          />
        </Header>
        {!!requestTables.length &&
          requestTables.map((table, index) => {
            return (
              <ServiceTable
                table={table}
                key={table.tableName}
                onUpdate={updatedTable => {
                  const currentRequestTables = [...requestTables];
                  currentRequestTables[index] = updatedTable;
                  setRequestTables(currentRequestTables);
                }}
              />
            );
          })}
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
                    tableName: `NewResponseTable${currentResponseTables.length +
                      1}`,
                    columns: [{ name: "column1", numeric: false }],
                    rows: [{ column1: "" }]
                  });
                  setResponseTables(currentResponseTables);
                }}
              />
            }
          />
        </Header>
        {!!responseTables.length &&
          service.response.map((table, index) => {
            return (
              <ServiceTable
                table={table}
                key={table.tableName}
                onUpdate={updatedTable => {
                  const currentResponseTables = [...responseTables];
                  currentResponseTables[index] = updatedTable;
                  setResponseTables(currentResponseTables);
                }}
              />
            );
          })}
      </Form>
    </Modal>
  ) : (
    <></>
  );
};

export default ServiceModal;
