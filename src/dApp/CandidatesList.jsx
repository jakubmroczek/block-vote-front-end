import * as React from 'react';
import { Button, Table, Form } from 'react-bootstrap';

import ElectionAPI from './electionAPI.js';

function CandidateRow({
  index, name, surname, checked, onChange,
}) {
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{surname}</td>
        <td>
          <Form.Check
            name={index}
            aria-label="option 1"
            checked={checked}
            onChange={onChange}
          />
        </td>
      </tr>
    </>
  );
}

export default class CandidatesList extends React.Component {
  constructor(props) {
    super(props);

    // -1 should be a constant.
    this.state = {
      selectedCandidate: null,
    };

    this.onClick = this.onClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  onClick() {
    const { selectedCandidate } = this.state;
    const { electionID } = this.props;

    // TODO: should it be comparet in this way?
    if (selectedCandidate !== null) {
      // TODO: Should this logic be here?
      // I must get candidateId somehow
      // TODO: Catch error
      new ElectionAPI()
        .vote(electionID, selectedCandidate)
        .then(() => {
          window.location.reload(false);
        })
        .catch(error => console.log(error));
    } else {
      alert('Please select a candidate before voting');
    }
  }

  handleToggle(index) {
    const { candidates } = this.props;
    const candidate = candidates[index] !== this.state.selectedCandidate ? candidates[index] : null;

    this.setState({
      selectedCandidate: candidate,
    });
  }

  render() {
    const { candidates } = this.props;
    const rows = candidates.map((candidate, index) => (
      <CandidateRow
        key={index}
        index={index}
        name={candidate.name}
        surname={candidate.surname}
        onChange={e => this.handleToggle(e.target.name)}
        checked={candidate === this.state.selectedCandidate}
      />
    ));

    return (
      <>
        <Table bordered condensed hover responsive className="text-centre">
          <tbody>
            {rows}
          </tbody>
        </Table>
        <Button variant="outline-success" onClick={this.onClick}>
          Vote
        </Button>
      </>
    );
  }
}
