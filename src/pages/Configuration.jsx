import React, { useContext, useState } from "react";
import { Header, Segment, Button, Form, Message } from "semantic-ui-react";
import { AppContext } from "../context/appContext";
import "./Configuration.scss";

const Configuration = () => {
  const { masterJson, setMasterJson } = useContext(AppContext);
  const [serverType, setServerType] = useState(
    masterJson && masterJson.sasJsConfig
      ? masterJson.sasJsConfig.serverType
      : null
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const appConfig =
    masterJson && masterJson.appConfig ? masterJson.appConfig : {};
  const sasJsConfig =
    masterJson && masterJson.sasJsConfig ? masterJson.sasJsConfig : {};

  const saveForm = event => {
    event.preventDefault();
    const appConfigFields = ["author", "name", "description"];
    const sasJsConfigFields = [
      "serverUrl",
      "appLoc",
      "pathSAS9",
      "pathSASViya"
    ];

    const appConfig = {};
    const sasJsConfig = {};
    appConfigFields.forEach(field => {
      appConfig[field] = event.target.elements[field].value;
    });
    sasJsConfigFields.forEach(field => {
      sasJsConfig[field] = event.target.elements[field].value;
    });
    sasJsConfig.serverType = serverType;
    setMasterJson({ ...masterJson, appConfig, sasJsConfig });
    setShowSuccessMessage(true);
  };

  return (
    <div className="configuration-container">
      <Header as="h1">Configuration</Header>
      {showSuccessMessage && (
        <Message positive>
          <Message.Header>
            Success! Your configuration has now been updated.
          </Message.Header>
          <p>
            You can export it as a JSON file from the{" "}
            <strong>Import / Export</strong> tab.
          </p>
        </Message>
      )}
      <Form className="config-form" onSubmit={saveForm}>
        <Segment size="huge" raised>
          <Header as="h3">App Configuration</Header>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Author</label>
              <input
                name="author"
                placeholder="Author"
                defaultValue={appConfig.author}
              />
            </Form.Field>
            <Form.Field>
              <label>Name</label>
              <input
                name="name"
                placeholder="Name"
                defaultValue={appConfig.name}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <input
                name="description"
                placeholder="Description"
                defaultValue={appConfig.description}
              />
            </Form.Field>
          </Form.Group>
          <Header as="h3">
            <code>SASjs</code> Configuration
          </Header>
          <Form.Field>
            <label>Server URL</label>
            <input
              name="serverUrl"
              placeholder="Description"
              defaultValue={sasJsConfig.serverUrl}
            />
          </Form.Field>
          <Form.Field>
            <label>App Location</label>
            <input
              name="appLoc"
              placeholder="App Location"
              defaultValue={sasJsConfig.appLoc}
            />
          </Form.Field>
          <Form.Field>
            <label>Server Type</label>
            <Form.Select
              name="serverType"
              placeholder="Server type"
              onChange={(_, { value }) => {
                setServerType(value);
              }}
              defaultValue={sasJsConfig.serverType}
              options={[
                {
                  key: "SAS9",
                  value: "SAS9",
                  text: "SAS9"
                },
                {
                  key: "SASVIYA",
                  value: "SASVIYA",
                  text: "SASVIYA"
                }
              ]}
            />
          </Form.Field>
          <Form.Field>
            <label>SAS9 Path</label>
            <input
              name="pathSAS9"
              placeholder="SAS9 Path"
              defaultValue={sasJsConfig.pathSAS9}
            />
          </Form.Field>
          <Form.Field>
            <label>SAS Viya Path</label>
            <input
              name="pathSASViya"
              placeholder="SAS Viya Path"
              defaultValue={sasJsConfig.pathSASViya}
            />
          </Form.Field>
        </Segment>
        <Button primary type="submit">
          Save configuration
        </Button>
      </Form>
    </div>
  );
};

export default Configuration;
