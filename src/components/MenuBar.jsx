import React from "react";
import { Menu, Popup, Header } from "semantic-ui-react";
import MenuBarItem from "./MenuBarItem";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MenuBar = () => {
  const location = useLocation();
  const { isDarkMode, setIsDarkMode } = useContext(AppContext);
  return (
    <Menu inverted={isDarkMode}>
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
      <Menu.Item>
        <Popup
          inverted
          content={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          trigger={
            <Header as="h1" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? "🌞" : "🌛"}
            </Header>
          }
        />
      </Menu.Item>
    </Menu>
  );
};

export default MenuBar;
