import React, { useState, useEffect } from "react";
import { Input, Modal, Header, Form } from "semantic-ui-react";
import "./ServiceModal.scss";
import ServiceTable from "./ServiceTable";

const ServiceModal = ({ service, isOpen }) => {
  const [name, setName] = useState(service ? service.name : "");
  const [description, setDescription] = useState(
    service ? service.description : ""
  );

  useEffect(() => {
    if (service) {
      setName(service.name);
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
        {service && service.request && (
          <>
            <Header as="h3" content="Request Tables" />
            {service.request.map(table => {
              return <ServiceTable table={table} key={table.tableName} />;
            })}
          </>
        )}
        {service && service.response && (
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
