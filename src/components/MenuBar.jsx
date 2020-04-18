import React from "react";
import { Menu } from "semantic-ui-react";
import MenuBarItem from "./MenuBarItem";
import { useLocation } from "react-router-dom";

const MenuBar = () => {
  const location = useLocation();
  return (
    <Menu>
      <Menu.Item>
        <MenuBarItem
          icon="file"
          link="/import-export"
          text="Import / Export"
          active={location.pathname === "/import-export"}
        />
      </Menu.Item>
      <Menu.Item>
        <MenuBarItem
          icon="settings"
          link="/configuration"
          text="Configuration"
          active={location.pathname === "/configuration"}
        />
      </Menu.Item>
      <Menu.Item>
        <MenuBarItem
          icon="server"
          link="/services"
          text="Services"
          active={location.pathname === "/services"}
        />
      </Menu.Item>
    </Menu>
  );
};

export default MenuBar;
