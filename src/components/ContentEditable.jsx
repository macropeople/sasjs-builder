import React, { useContext } from "react";
import ContentEditable from "react-contenteditable";
import { toast } from "react-semantic-toasts";
import { AppContext } from "../context/AppContext";
import "./ContentEditable.scss";

const CustomContentEditable = (props) => {
  const { isDarkMode } = useContext(AppContext);
  const disableNewlines = (event) => {
    const keyCode = event.keyCode || event.which;
    const value = event.target.innerText;
    let isValid = true;
    let toastMessage = "";
    const maxLength = props.maxLength ? props.maxLength : 32;
    const allowSpaces = !!props.allowSpaces;

    if (keyCode === 13) {
      event.returnValue = false;
      event.preventDefault();
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }

    if (keyCode === 32 && !allowSpaces) {
      isValid = false;
      toastMessage = "Spaces are not allowed in this field.";
    }

    if (value.length > maxLength) {
      isValid = false;
      toastMessage = "The maximum length of this field is 32 characters";
    }

    if (!isValid) {
      event.returnValue = false;
      event.preventDefault();
      toast({
        type: "error",
        icon: "warning sign",
        title: "Please check your input",
        description: toastMessage,
        time: 2000,
      });
    }
  };

  return (
    <ContentEditable
      {...props}
      onKeyPress={disableNewlines}
      className={`${props.className ? props.className : ""} ${
        isDarkMode ? "dark-mode" : ""
      }`}
    />
  );
};

export default CustomContentEditable;
