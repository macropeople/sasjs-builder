import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import ImportExport from "./pages/ImportExport";
import Configuration from "./pages/Configuration";
import Services from "./pages/Services";
import { AppProvider } from "./context/appContext";
import SideBar from "./components/SideBar";

const App = () => {
  return (
    <div className="root">
      <AppProvider>
        <HashRouter>
          <div className="sidebar">
            <SideBar />
          </div>
          <div className="main">
            <Switch>
              <Route exact path="/import-export" component={ImportExport} />
              <Route exact path="/configuration" component={Configuration} />
              <Route exact path="/services" component={Services} />
            </Switch>
            <Redirect from="/" to="/import-export" />
          </div>
        </HashRouter>
      </AppProvider>
    </div>
  );
};

export default App;
