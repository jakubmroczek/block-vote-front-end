import React from 'react';
import {
  Container, Row, Col, Spinner, Card,
} from 'react-bootstrap';

import ElectionAPI from './electionAPI.js';
import ElectionList from './ElectionList.jsx';
import ReturnHomeButton from './ReturnHomeButton.jsx';
import graphQLFetch from '../graphQLFetch.js';

export default class DApp extends React.Component {
  constructor() {
    super();
    this.state = {
      isMetaMaskInstalled: true,
    };
  }

  componentDidMount() {
    this.read();
  }

  async getPublicKey() {
    const publicKey = await new ElectionAPI().getUserPublicKey();
    return publicKey;
  }

  async read() {
    const query = `query listVoterElections($publicKey: PublicKey!) {
      listVoterElections(publicKey: $publicKey) {
        id 
        title
      }
    }`;

    try {
      const publicKey = await this.getPublicKey();
      const response = await graphQLFetch(query, { publicKey });

      if (response) {
        this.setState({
          publicKey,
          elections: response.listVoterElections,
        });
      } else {
        alert(`Could not fetch elections for the public key: ${publicKey}`);
      }
    } catch (err) {
      this.setState({
        elections: [],
        isMetaMaskInstalled: false,
      });
    }
  }

  render() {
    if (!('elections' in this.state)) {
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
          <Row>
            <ReturnHomeButton />
          </Row>
        </Container>
      );
    }

    const { isMetaMaskInstalled } = this.state;

    if (!isMetaMaskInstalled) {
      return (
        <Card className="text-center mt-2 mr-3">
          <Card.Header as="h5">
            Oooops! Did not found MetMask plugin. Please install it.
          </Card.Header>
          <Card.Footer>
            <ReturnHomeButton />
          </Card.Footer>
        </Card>
      );
    };
    
    const { elections, publicKey } = this.state;
    const { history } = this.props;

    return (
      <ElectionList elections={elections} publicKey={publicKey} history={history} />
    );
  }
}
