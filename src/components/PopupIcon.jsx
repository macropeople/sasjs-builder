import React from "react";
import { Icon, Popup } from "semantic-ui-react";
import "./PopupIcon.scss";

const PopupIcon = ({text, icon, color, onClick}) => {
    return <Popup
    inverted
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
}

export default PopupIcon;