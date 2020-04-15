import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Label } from "semantic-ui-react";
import "./SidebarItem.scss";

const SidebarItem = ({ icon, link, text, showLabel, active }) => {
  return (
    <Link to={link}>
      <Menu.Item
        as="span"
        className={active ? "sidebar-item active" : "sidebar-item"}
      >
        <Icon name={icon} />
        {text}
        {showLabel && (
          <Label color="teal" floating>
            New!
          </Label>
        )}
      </Menu.Item>
    </Link>
  );
};

export default React.memo(SidebarItem);
