import React, { useState, useEffect } from "react";
import { Input, Modal, Header, Form } from "semantic-ui-react";
import "./ServiceModal.scss";
import ServiceTable from "./ServiceTable";

const ServiceModal = ({ service, isOpen }) => {
  const [name, setName] = useState(service ? service.name : "");
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
  return (
    <Modal
      open={isOpen}
      size="large"
      closeOnEscape={true}
      closeOnDimmerClick={true}
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
        {requestTables.length && (
          <>
            <Header as="h3" content="Request Tables" />
            {requestTables.map(table => {
              return <ServiceTable table={table} key={table.tableName} />;
            })}
          </>
        )}
        {responseTables.length && (
          <>
            <Header as="h3" content="Response Tables" />
            {service.response.map(table => {
              return <ServiceTable table={table} key={table.tableName} />;
            })}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ServiceModal;
