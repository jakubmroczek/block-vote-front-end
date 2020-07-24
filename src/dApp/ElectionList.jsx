/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import ReturnHomeButton from './ReturnHomeButton.jsx';

function ElectionRow({ election, onElectionRowClick }) {
  const { id, title } = election;
  const vote = () => onElectionRowClick(id);
  return (
    <>
      <tr>
        <td>{title}</td>
        <td>
          {' '}
          <Button variant="secondary" onClick={vote}>Vote</Button>
          {' '}
        </td>
      </tr>
    </>
  );
}

function ElectionTable({ elections, onElectionRowClick }) {
  const rows = elections
    .map((election, index) => (
      <ElectionRow
        index={index}
        election={election}
        onElectionRowClick={onElectionRowClick}
      />
    ));

  return (
    <Table bordered condensed hover responsive className="text-centre">
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
}

export default class ElectionList extends React.Component {
  constructor(props) {
    super(props);
    this.onElectionRowClick = this.onElectionRowClick.bind(this);
  }

  onElectionRowClick(electionID) {
    const { history } = this.props;
    history.push(`/vote/${electionID}`);
  }

  render() {
    const { elections, publicKey } = this.props;

    if (elections.length === 0) {
      return (
        <Card className="text-center mt-2 mr-3">
          <Card.Header as="h5">
            No elections found for the public key:
            {' '}
            {publicKey}
          </Card.Header>
          <Card.Footer>
            <ReturnHomeButton />
          </Card.Footer>
        </Card>
      );
    }

    return (
      <Card className="text-center mt-2 mr-3">
        <Card.Header as="h5">Your elections:</Card.Header>
        <Card.Body>
          <ElectionTable
            elections={elections}
            onElectionRowClick={this.onElectionRowClick}
          />
        </Card.Body>
        <Card.Footer>
          <ReturnHomeButton />
        </Card.Footer>
      </Card>
    );
  }
}
