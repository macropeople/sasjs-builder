import React, { useState, useCallback, useContext } from "react";
import { Modal, Input, Form, Header, Button, Icon } from "semantic-ui-react";
import { AppContext } from "../context/appContext";
import "./LoginModal.scss";

const LoginModal = ({ isOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const appContext = useContext(AppContext);

  const logIn = useCallback(() => {
    appContext.logIn(username, password);
  }, [username, password, appContext]);

  return (
    <Modal open={isOpen} size="mini">
      <Header icon="sign-in" content="Sign in" />
      <Modal.Content>
        <p>Please sign in with your SAS server credentials.</p>
        <Form onSubmit={logIn}>
          <Form.Field>
            <label>Username</label>
            <Input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Button primary type="submit" className="login-button">
              <Icon name="rocket" />
              Sign In
            </Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
