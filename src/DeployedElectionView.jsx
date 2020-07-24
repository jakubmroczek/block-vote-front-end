import React from 'react';
import {
  Button, Container, Row, Col, Spinner,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import ElectionAPI from './dApp/electionAPI.js';

// TODO: Rename this, I do not have a better name right now
// TODO: Improve the code quality.
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
