import React, { useState, useContext } from "react";
import { Button, Icon, Header } from "semantic-ui-react";
import { AppContext } from "../context/AppContext";
import Highlight from "react-highlight.js";
import LoginModal from "../pages/LoginModal";

const TryItOut = ({
  path,
  serviceName,
  requestTables,
  responseTables,
  isDarkMode,
}) => {
  const { adapter, isLoggedIn } = useContext(AppContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const makeRequest = () => {
    setError(null);
    setResponse(null);
    adapter
      .request(`${path}/${serviceName}`, requestTables)
      .then((res) => setResponse(res))
      .catch((e) => setError(e));
  };
  return (
    <div className="try-it-out">
      <div className="tables-header">
        <Header as="h3" inverted={isDarkMode}>
          Try it out
        </Header>
      </div>
      {isLoggedIn ? (
        <Button color="green" onClick={makeRequest}>
          <Icon name="paper plane outline"></Icon>Send request
        </Button>
      ) : (
        <Button color="blue" onClick={() => setIsLoginModalOpen(true)}>
          <Icon name="sign-in"></Icon>Sign in to send request
        </Button>
      )}
      {isLoginModalOpen && (
        <LoginModal
          isDarkMode={isDarkMode}
          onLogin={() => setIsLoginModalOpen(false)}
        />
      )}
      {!!response ||
        (!!error && (
          <Highlight
            language="javascript"
            className="code-snippet"
            style={{ marginTop: "10px" }}
          >
            {!!response && JSON.stringify(response, null, 1)}
            {!!error && (
              <span className="error">{JSON.stringify(error, null, 1)}</span>
            )}
          </Highlight>
        ))}
    </div>
  );
};

export default TryItOut;
