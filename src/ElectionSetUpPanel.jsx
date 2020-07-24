import React from 'react';
import { Button } from 'react-bootstrap';

import ElectionTitleForm from './ElectionTitleForm.jsx';
import CandidateList from './CandidateList.jsx';
import ParticipantList from './ParticipantList.jsx';

import graphQLFetch from './graphQLFetch.js';

// TODO: Make it fucntional
export default class ElectionSetUpPanel extends React.Component {
  constructor(props) {
    super(props);

    const { id } = this.props;

    this.state = {
      id,
      title: '',
      candidates: [],
      participants: [],
    };

    this.deploy = this.deploy.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query 
    getUserElection {
      getUserElection {
                title
                candidates {
                  name surname
                }  
                participants {
                  email
                }
            }
}`;

    const { id } = this.state;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const { title, candidates, participants } = response.getUserElection;
      this.setState({ title, candidates, participants });
    } else {
      alert('getUserElection call failed');
    }
  }

  async update(changes) {
    const query = `mutation 
        updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
          updateElection(id: $id, changes: $changes) {
            id      
          }
    }`;

    const { id } = this.state;

    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.read();
    } else {
      alert(`Could send the changes to the backend`);
    }
  }

  async deploy() {
    const query = `mutation startPublicKeyRegistration {
      startPublicKeyRegistration 
    }`;

    const { id } = this.state;
    const vars = { id };
    const response = await graphQLFetch(query, vars);

    if (response) {
      const { history } = this.props;
      history.push('/panel/lobby');

      // TODO: We must somehow update the state of a parent component.
      // TODO: How should we apporach this?
    } else {
      alert('Could not go with the election to the further stage');
    }
  }

  render() {
    const {
      title, candidates, participants,
    } = this.state;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} className="mt-1">
        <ElectionTitleForm title={title} update={this.update} />
        <CandidateList candidates={candidates} update={this.update} />
        <ParticipantList participants={participants} update={this.update} />
        <Button onClick={this.deploy} variant="outline-success" className="mt-2">Next</Button>
      </div>
    );
  }
}
