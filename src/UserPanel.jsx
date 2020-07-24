import React from 'react';
import {
  Button, Spinner, Container, Row, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import ElectionLobby from './ElectionLobby.jsx';
import DeployedElectionView from './DeployedElectionView.jsx';
import UserContext from './UserContext.js';

const EditElectionInfo = withRouter(({ id, location: { search } }) => {
  const editLocation = { pathname: `/panel/edit/${id}`, search };

  return (
    <>
      <h1>You created an election, but did not finish editing it! Edit!</h1>
      <LinkContainer to={editLocation}>
        <Button>Edit!</Button>
      </LinkContainer>
    </>
  );
});

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
    if (status === 'Finished') {
      return (
        <EditElectionInfo id={id} />
      );
    }

    if (status === 'New') {
      return (
        <EditElectionInfo id={id} />
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
