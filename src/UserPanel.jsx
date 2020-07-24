import React from 'react';
import {
  Button, Spinner, Container, Row, Col,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import ElectionLobby from './ElectionLobby.jsx';
import DeployedElectionView from './DeployedElectionView.jsx';
import UserContext from './UserContext.js';
import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';

function CreateElectionItem({ onElectionCreated }) {
  const createElection = async () => {
    const query = `mutation {
      createElection {
        id
        status
      }
    }`;

    const response = await graphQLFetch(query);
    if (response) {
      onElectionCreated();
    } else {
      alert('Could not create the Election');
    }
  };

  return (
    <>
      <Container className="mt-3 text-center">
        <Row>
          <Col className="mt-3" style={{ fontSize: 20 }}>
            Currently you do not have any election
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button onClick={createElection} variant="outline-success">Create one</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default class UserPanel extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.read = this.read.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query {
      getUserElection {
        id
        status
        participants {
          email
        }
      }
    }`;

    const response = await graphQLFetch(query);

    if (response) {
      this.setState({
        election: response.getUserElection,
      });
    } else {
      this.setState({
        election: null,
      });
    }
  }

  render() {
    if (!('election' in this.state)) {
      return (
        <Container>
          <Row>
            <Col>
              <Spinner animation="border" />
            </Col>
          </Row>
          <Row>
            <Col>
              Connecting to the server. Wait a moment please...
            </Col>
          </Row>
        </Container>
      );
    }


    const { election } = this.state;

    if (election === null) {
      return (
        <CreateElectionItem onElectionCreated={this.read} />
      );
    }

    const { id, status } = election;

    // TODO: Refactor this code
    // TODO: What does this logic means?
    if (status === 'New' ||
       status === 'Finished') {
      return (
        <ElectionSetUpPanel id={id} />
      );
    }

    const { participants } = election;
    if (status === 'Registration') {
      return (
        <ElectionLobby id={id} totalNumberOfVoters={participants.length} />
      );
    }

    // Election must be deployed, no other option
    return (
      <DeployedElectionView id={id} />
    );
  }
}

UserPanel.contextType = UserContext;
