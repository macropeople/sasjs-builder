import React, { useState, useEffect } from "react";
import { Input, Modal, Header, Form } from "semantic-ui-react";
import "./ServiceModal.scss";

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
          <Input
            type="text"
            defaultValue={name}
            placeholder="Service Name"
            onChange={e => setName(e.target.value)}
          />
          <Input
            type="text"
            defaultValue={description}
            placeholder="Service Description"
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
