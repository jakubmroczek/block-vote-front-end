import React from 'react';
import { Button } from 'react-bootstrap';
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
    <>
      <h1>Election successfully deployed on the blockchain</h1>
      <Button
        variant="outline-success"
        onClick={onElectionFinish}
      >
        Finish the election
      </Button>
    </>
  );
}
