import React from "react";
import { Icon, Popup } from "semantic-ui-react";
import "./PopupIcon.scss";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const PopupIcon = ({ text, icon, color, onClick }) => {
  const { isDarkMode } = useContext(AppContext);
  return (
    <Popup
      inverted={isDarkMode}
      content={text}
      trigger={
        <Icon
          name={icon}
          className="icon-button"
          color={color}
          onClick={onClick}
        />
      }
    />
  );
};

export default PopupIcon;
