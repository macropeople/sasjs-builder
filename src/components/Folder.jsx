import React, { useState } from "react";
import { Icon, Confirm } from "semantic-ui-react";
import "./Folder.scss";
import PopupIcon from "./PopupIcon";
import { useEffect } from "react";

const Folder = (props) => {
  const {
    folder,
    selected,
    onClick,
    onDelete,
    onServiceClick,
    onAddService,
    selectedServiceIndex,
  } = props;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(selected);

  useEffect(() => {
    setIsExpanded(selected);
  }, [selected]);
  return (
    <>
      <div className="folder-container">
        <div
          className={selected ? "folder folder-selected" : "folder"}
          onClick={() => {
            onClick(folder);
          }}
        >
          <Icon name="folder"></Icon> {folder.name}
        </div>
        <PopupIcon
          text="Delete folder"
          icon="trash alternate outline"
          color="red"
          onClick={() => {
            setShowConfirmDelete(true);
          }}
        />
      </div>
      <div className="folder-services">
        {isExpanded &&
          folder.services.map((service, index) => {
            return (
              <div
                key={service.name}
                className={
                  selectedServiceIndex === index ? "service active" : "service"
                }
                onClick={() => onServiceClick(index)}
              >
                {service.name}
              </div>
            );
          })}
        <PopupIcon
          icon="add"
          color="blue"
          text="Add service"
          onClick={() => onAddService()}
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
