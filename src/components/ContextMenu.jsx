import React, { useState, useRef, useCallback } from "react";
import { Button, Menu, Popup, Ref, Icon, Label } from "semantic-ui-react";
import "./ContextMenu.scss";

const ContextMenu = ({ onRemove, onChangeType, numeric }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    [open]
  );
  const handlePopupClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Ref innerRef={buttonRef}>
        <Button
          className="context-menu-button"
          circular
          size="mini"
          icon="options"
          onClick={handleContextMenu}
        />
      </Ref>
      <Popup
        className="context-menu"
        context={buttonRef}
        onClose={handlePopupClose}
        open={open}
        flowing
        position="bottom center"
      >
        <Menu secondary vertical>
          <Menu.Item onClick={onRemove}>
            <Icon name="trash alternate outline" />
            Remove column
          </Menu.Item>
          <Menu.Item onClick={onChangeType}>
            <Label circular color="teal" size="mini">
              <img
                className="type-label"
                src={numeric ? "abc.png" : "123.png"}
                alt="type"
              />
            </Label>
            {numeric ? "Change to non-numeric" : "Change to numeric"}
          </Menu.Item>
        </Menu>
      </Popup>
    </>
  );
};

export default ContextMenu;
