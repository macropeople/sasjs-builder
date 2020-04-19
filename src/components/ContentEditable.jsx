import React from "react";
import ContentEditable from "react-contenteditable";
import { toast } from "react-semantic-toasts";

const CustomContentEditable = (props) => {
  const disableNewlines = (event) => {
    const keyCode = event.keyCode || event.which;
    const value = event.target.innerText;
    let isValid = true;
    let toastMessage = "";

    if (keyCode === 13) {
      isValid = false;
      toastMessage = "Spaces are not allowed in this field.";
    }

    if (keyCode === 32) {
      isValid = false;
      toastMessage = "Newline characters are not allowed in this field.";
    }

    if (value.length > 32) {
      isValid = false;
      toastMessage = "The maximum length of this field is 32 characters";
    }
    if (!/^[_a-zA-Z]+[_a-zA-Z0-9]*/.test(value)) {
      isValid = false;
      toastMessage = (
        <>
          Please make sure to follow the SAS naming convention for names:
          <ul>
            <li>Starts with a letter or an underscore.</li>
            <li>Contains only letters, numbers and underscores.</li>
            <li>Has a maximum length of 32.</li>
          </ul>
        </>
      );
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

  return <ContentEditable {...props} onKeyPress={disableNewlines} />;
};

export default CustomContentEditable;
