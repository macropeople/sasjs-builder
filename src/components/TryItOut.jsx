import React from "react";
import { Button, Icon, Header } from "semantic-ui-react";
import { useContext } from "react";
import { AppContext } from "../context/appContext";

const TryItOut = ({ path, serviceName, requestTables, responseTables }) => {
  const { adapter } = useContext(AppContext);
  const makeRequest = () => {
    adapter.request(`${path}/${serviceName}`, requestTables).then(console.log);
  };
  return (
    <div className="try-it-out">
      <Header as="h3" className="tables-header">
        Try it out
      </Header>
      <Button secondary onClick={makeRequest}>
        <Icon name="rocket"></Icon>Send request
      </Button>
    </div>
  );
};

export default TryItOut;
