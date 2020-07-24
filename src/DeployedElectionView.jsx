import React from 'react';
import {
  Button, Container, Row, Col, Spinner,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

// TODO: Rename this, I do not have a better name right now
export default function DeployedElectionView({ id }) {
  const onElectionFinish = async () => {
    // TODO: Ask the user if he really wants to do this
    // TODO: Check if the graph ql query syntax can be shorter
    const query = `mutation 
        finishElection {
            finishElection
        }`;

    const response = await graphQLFetch(query, { id });

    if (response) {
      alert('Finished the election success');
    } else {
      alert('Finished the election failure');
    }
  };

  return (
    <Container className="mt-3 text-center">
      <Row className="mt-3 text-centre" style={{ fontSize: 20 }}>
        <Col>
          The election is in progress. Number of a casted votes:
          {' '}
          ?
          /
          ?
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Spinner animation="border" />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Button
            variant="outline-success"
            onClick={onElectionFinish}
          >
            End the election
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
