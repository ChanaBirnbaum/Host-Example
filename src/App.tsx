// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { AliveScope, KeepAlive } from "react-keep-alive";

import PageA from "./PageA";
import PageB from "./PageB";

export default function App() {
  return (
    <AliveScope>
      <Router>
        <nav style={{ padding: 10 }}>
          <Link to="/a" style={{ marginRight: 10 }}>עמוד A</Link>
          <Link to="/b">עמוד B</Link>
        </nav>

        <Switch>
          <Route path="/a">
            <KeepAlive name="PageA">
              <PageA />
            </KeepAlive>
          </Route>

          <Route path="/b">
            <KeepAlive name="PageB">
              <PageB />
            </KeepAlive>
          </Route>
        </Switch>
      </Router>
    </AliveScope>
  );
}
