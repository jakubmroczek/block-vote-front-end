import React from 'react';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { isLoggedIn: false, email: '' },
    };
    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  setUser(user) {
    this.setState({
      user,
    });
  }

  async fetchUser() {
    const endpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${endpoint}/user`, {
      method: 'POST',
    });

    const body = await response.text();
    const result = JSON.parse(body);

    const { isLoggedIn, email } = result;
    const user = { isLoggedIn, email };

    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <UserContext.Provider value={user}>
        <Contents setUser={this.setUser} />
      </UserContext.Provider>
    );
  }
}
