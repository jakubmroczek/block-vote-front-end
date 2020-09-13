import React from 'react';
import {
  Button, Container, Row, Col, Spinner,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import ElectionAPI from './dApp/electionAPI.js';

export default class DeployedElectionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfCastedVotes: '?',
      totallNumberOfVoters: '?',
    };
    this.getNumberOfCastedVotes = this.getNumberOfCastedVotes.bind(this);
  }

  componentDidMount() {
    this.getTotallNumberOfVoters();
    this.getNumberOfCastedVotes();
    this.timer = setInterval(() => this.getNumberOfCastedVotes(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getNumberOfCastedVotes() {
    const { id } = this.props;
    const api = new ElectionAPI();
    await api.getNumberOfCastedVotes(id)
      .then(numberOfCastedVotes => this.setState({ numberOfCastedVotes }));
  }

  async getTotallNumberOfVoters() {
    const { id } = this.props;
    const api = new ElectionAPI();
    await api.getNumberOfEligibleVoters(id)
      .then(totallNumberOfVoters => this.setState({ totallNumberOfVoters }));
  }

  render() {
    const { id } = this.props;

    const onElectionFinish = async () => {
      const query = `mutation 
          finishElection {
              finishElection
          }`;

      const response = await graphQLFetch(query, { id });

      if (response) {
        const { callback } = this.props;
        callback();
      } else {
        alert('Could not finish the election');
      }
    };

    const { numberOfCastedVotes, totallNumberOfVoters } = this.state;

    return (
      <Container className="mt-3 text-center">
        <Row className="mt-3 text-centre" style={{ fontSize: 20 }}>
          <Col>
            The election is in progress. Number of a casted votes:
            {' '}
            {numberOfCastedVotes}
            /
            {totallNumberOfVoters}
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
}
