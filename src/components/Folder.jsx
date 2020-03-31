import React, { useState } from "react";
import { Icon, Confirm, Popup } from "semantic-ui-react";
import "./Folder.scss";

const Folder = props => {
  const { folder, selected, onClick, onDelete } = props;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  return (
    <>
      <div className="folder-container">
        <div
          className={selected ? "folder folder-selected" : "folder"}
          onClick={() => onClick(folder)}
        >
          <Icon name="folder"></Icon> {folder.name}
        </div>
        <Popup
          inverted
          content="Delete folder"
          trigger={
            <Icon
              name="trash alternate outline"
              color="red"
              onClick={() => {
                setShowConfirmDelete(true);
              }}
            />
          }
        />
      </div>
      <Confirm
        open={showConfirmDelete}
        header={`Delete Folder ${folder.name}`}
        content="Are you sure you want to delete this folder?"
        confirmButton="Yes"
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => onDelete(folder)}
      />
    </>
  );
};

export default Folder;
