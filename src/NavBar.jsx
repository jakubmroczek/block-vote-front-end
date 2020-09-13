import React from 'react';
import {
  Navbar, Nav, Button, Modal,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

async function initGApi() {
  const clientId = window.ENV.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return;
  }
  window.gapi.load('auth2', () => {
    if (!window.gapi.auth2.getAuthInstance()) {
      window.gapi.auth2.init({ client_id: clientId }).then(() => {
      });
    }
  });
}

class SignInPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
  }

  async componentDidMount() {
    await initGApi();
  }

  async onSignInSubmit() {
    const { hide } = this.props;
    hide();

    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (e) {
      const message = JSON.stringify(e);
      alert(`Error authenticating with Google: ${message}`);
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken }),
      });

      const body = await response.text();
      const result = JSON.parse(body);

      const { isLoggedIn, email } = result;
      const user = { isLoggedIn, email };

      const { onSignIn } = this.props;
      onSignIn(user);
    } catch (error) {
      alert(`Error signing into the app: ${error}`);
    }
  }

  render() {
    const { visible, hide } = this.props;
    return (
      <Modal centered keyboard show={visible} style={{ opacity: 1 }} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            block
            onClick={this.onSignInSubmit}
            variant="outline-success"
          >
            <img src="signWithGoogle.png" alt="Sign In" />
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide} variant="outline-dark">Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function LogOutButton({ user, onLogOut }) {
  return (
    <>
      <Navbar.Text className="mr-1">
        {user.email}
      </Navbar.Text>
      <Button variant="outline-success" onClick={onLogOut}>Log out</Button>
    </>
  );
}

function SignInButton({ onSignIn }) {
  return (
    <Button variant="outline-success" onClick={onSignIn}>Sign in</Button>
  );
}

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSignInPopUpVisible: false };
    this.onLogOut = this.onLogOut.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.showSignInPopUp = this.showSignInPopUp.bind(this);
    this.hideSignInPopUp = this.hideSignInPopUp.bind(this);
  }

  async onLogOut() {    
    await initGApi();

    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;

    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
      });
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();

      const user = { isLoggedIn: false, email: null };
      const { setUser } = this.props;
      setUser(user);

      const { history } = this.props;
      history.push('/');

    } catch (error) {
      alert(`Error signing out ${error}`);
    }
  }

  onSignIn(user) {
    const { setUser } = this.props;
    setUser(user);
    const { history } = this.props;
    history.push('/panel');
  }

  showSignInPopUp() {
    this.setState({ isSignInPopUpVisible: true });
  }

  hideSignInPopUp() {
    this.setState({ isSignInPopUpVisible: false });
  }

  render() {
    const user = this.context;
    const { isLoggedIn } = user;

    const { isSignInPopUpVisible } = this.state;

    return (
      <>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <img
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="BlockVote logo"
            />
            {' '}
            BlockVote
          </Navbar.Brand>
          <Nav className="ml-auto">
            {
          isLoggedIn
          ? <LogOutButton onLogOut={this.onLogOut} user={user} />
            : <SignInButton onSignIn={this.showSignInPopUp} />
        }
          </Nav>
        </Navbar>
        <SignInPopUp visible={isSignInPopUpVisible} hide={this.hideSignInPopUp} onSignIn={this.onSignIn} />
      </>
    );
  }
}

NavBar.contextType = UserContext;
