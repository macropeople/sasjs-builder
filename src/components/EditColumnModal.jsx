import React from "react";
import {
  Modal,
  Header,
  Form,
  Input,
  Button,
  Checkbox,
} from "semantic-ui-react";
import { useState, useEffect, useRef } from "react";

const EditColumnModal = ({ column, onEdit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);
  return (
    <Modal open={isOpen} size="tiny">
      <Header icon="edit" content="Edit column" />
      <Form
        className="new-folder-form"
        onSubmit={(e) => {
          onEdit({
            title: e.target.elements.columnName.value,
            type: e.target.elements.numeric.checked ? "numeric" : "text",
          });
          setIsOpen(false);
        }}
      >
        <Modal.Content>
          <Form.Field>
            <h4>Column Name</h4>
            <Input
              ref={inputRef}
              type="text"
              name="columnName"
              placeholder="Column Name"
              maxLength="32"
              defaultValue={column.title}
              pattern="[_a-zA-Z][_a-zA-Z0-9]*"
              required
              autoFocus
            />
          </Form.Field>
          <Form.Field>
            <label>Numeric</label>
            <Checkbox
              name="numeric"
              toggle
              defaultChecked={column.type === "numeric"}
            ></Checkbox>
          </Form.Field>
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
            Save
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
};

export default EditColumnModal;
