import React, { useContext } from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import SidebarItem from "./SidebarItem";
import { AppContext } from "../context/appContext";
import { useLocation } from "react-router-dom";

const SideBar = () => {
  const { isNewJson } = useContext(AppContext);
  const location = useLocation();
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible
    >
      <SidebarItem
        icon="file"
        link="/import-export"
        text="Import / Export"
        active={location.pathname === "/import-export"}
      />
      <SidebarItem
        icon="settings"
        link="/configuration"
        text="Configuration"
        showLabel={isNewJson}
        active={location.pathname === "/configuration"}
      />
      <SidebarItem
        icon="server"
        link="/services"
        text="Services"
        active={location.pathname === "/services"}
      />
    </Sidebar>
  );
};

export default SideBar;
