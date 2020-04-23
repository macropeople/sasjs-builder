import React from "react";
import { Modal, Header, Form, Input, Button } from "semantic-ui-react";
import { useState } from "react";

const RenameColumnModal = ({ columnName, onRename }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal open={isOpen} size="tiny">
      <Header icon="edit" content="Rename column" />
      <Form
        className="new-folder-form"
        onSubmit={(e) => {
          onRename(e.target.elements.columnName.value);
          setIsOpen(false);
        }}
      >
        <Modal.Content>
          <h4>Enter the new name for this column.</h4>
          <Input
            type="text"
            name="columnName"
            placeholder="Column Name"
            maxLength="32"
            defaultValue={columnName}
            pattern="[_a-zA-Z][_a-zA-Z0-9]*"
            required
            autoFocus
          />
          <div className="naming-conventions">
            Please make sure to follow the SAS naming convention for names:
            <ul>
              <li>Starts with a letter or an underscore.</li>
              <li>Contains only letters, numbers and underscores.</li>
              <li>Has a maximum length of 32.</li>
            </ul>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button type="submit" color="green">
            Add
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
};

export default RenameColumnModal;
