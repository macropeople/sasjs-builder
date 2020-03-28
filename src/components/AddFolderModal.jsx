import React from "react";
import { Modal, Message, Header, Form, Input, Button } from "semantic-ui-react";

const AddFolderModal = ({
  isOpen,
  onAddFolder,
  showFolderNameError,
  onCancel
}) => {
  return (
    <Modal open={isOpen} size="tiny">
      <Header icon="add" content="Add New Folder" />
      <Form
        className="new-folder-form"
        onSubmit={e => onAddFolder(e.target.elements.folderName.value)}
      >
        <Modal.Content>
          {showFolderNameError && (
            <Message negative>
              <Message.Header>
                A folder with that name already exists
              </Message.Header>
              Please try again with another folder name.
            </Message>
          )}
          <h4>Enter the name for your new folder.</h4>
          <Input
            type="text"
            name="folderName"
            placeholder="Folder Name"
            maxLength="32"
            pattern="[_a-zA-Z][_a-zA-Z0-9]*"
            required
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
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" color="green">
            Add
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
};

export default AddFolderModal;
