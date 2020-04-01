import React, { useState, useContext } from "react";
import { Button, Header } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ImportExport.scss";
import FileUpload from "../components/FileUpload";
import { AppContext } from "../context/appContext";

const ImportExport = () => {
  const { setMasterJson, masterJson } = useContext(AppContext);
  const [json, setJson] = useState(null);

  const importJson = () => {
    setMasterJson(json);
    toast({
      type: "success",
      icon: "file",
      title: "File imported successfully",
      description: `Your configuration and services have now been loaded.`,
      time: 2000
    });
  };

  const exportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(masterJson, null, 2));
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", "sasServices.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const onFileChanged = event => {
    let file = event.target.files[0];
    if (!file) {
      setJson(null);
      return;
    }

    let reader = new FileReader();
    reader.onload = (() => {
      return function(e) {
        let json = null;
        try {
          json = JSON.parse(e.target.result);
        } catch (e) {
          toast({
            type: "error",
            icon: "file",
            title: "Oops! There was an error parsing your JSON file.",
            description: `Your JSON file could not be parsed. Please check the file and try again`,
            time: 2000
          });
        }
        if (json) {
          setJson(json);
          toast({
            type: "success",
            icon: "file",
            title: "File read successful",
            description: `Your JSON file has now been read. Click Import JSON to load it in.`,
            time: 2000
          });
        }
      };
    })();
    reader.readAsText(file);
  };
  return (
    <div className="import-export-container">
      <Header as="h1">Import / Export</Header>
      <div className="file-upload">
        <FileUpload text="Upload JSON file" onFileChange={onFileChanged} />
        {json && (
          <Button secondary onClick={importJson}>
            Import JSON
          </Button>
        )}
        {!!Object.keys(masterJson).length && (
          <Button secondary onClick={exportJson}>
            Export JSON
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportExport;
