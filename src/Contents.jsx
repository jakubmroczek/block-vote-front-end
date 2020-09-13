/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';
import UserPanel from './UserPanel.jsx';
import NavBar from './NavBar.jsx';
import WelcomePage from './WelcomePage.jsx';
import RegisterPublicKeyPanel from './register/RegisterPublicKeyPanel.jsx';
import DApp from './dApp/DApp.jsx';
import Election from './dApp/Election.jsx';
import UserContext from './UserContext.js';

const NotFound = () => <h1>Error: page not found</h1>;

export default class Contents extends React.Component {
  render() {
    const user = this.context;
    const { isLoggedIn } = user;
    const { setUser } = this.props;

    return (
      <>
        <Route path="/" render={props => <NavBar {...props} setUser={setUser} />} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (isLoggedIn
              ? <Redirect to="/panel" />
              : <WelcomePage />

            )}
          />
          <Route exact path="/panel" component={UserPanel} />
          <Route exact path="/vote" component={DApp} />
          <Route exact path="/vote/:electionID" component={Election} />
          <Route path="/register/:electionID" component={RegisterPublicKeyPanel} />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }
}

Contents.contextType = UserContext;
