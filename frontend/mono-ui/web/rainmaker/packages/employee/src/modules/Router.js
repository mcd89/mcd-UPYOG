import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Employee from "modules/employee";

const Main = ({ routes, hasLocalisation, defaultUrl }) => {
  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
  return (
    <main>
      <Switch>
        <Route
          path={`/`}
          render={(props) => {
            return <Employee match={props.match} routes={routes.employee} />;
          }}
        />

        <Redirect from="/" to={isLocalhost && hasLocalisation ? "/language-selection" : defaultUrl.employee} />
      </Switch>
    </main>
  );
};

export default Main;
