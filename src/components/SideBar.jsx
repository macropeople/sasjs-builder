import React, { useContext } from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import SidebarItem from "./SidebarItem";
import { AppContext } from "../context/appContext";

const SideBar = () => {
  const { isNewJson } = useContext(AppContext);
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible
    >
      <SidebarItem icon="file" link="/import-export" text="Import / Export" />
      <SidebarItem
        icon="settings"
        link="/configuration"
        text="Configuration"
        showLabel={isNewJson}
      />
      <SidebarItem icon="server" link="/services" text="Services" />
    </Sidebar>
  );
};

export default SideBar;
