import React from 'react';

import { Card } from 'react-bootstrap';
import CandidatesList from './CandidatesList.jsx';
import ElectionFetching from './ElectionFetching.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import ElectionAPI from './electionAPI.js';
import ReturnHomeButton from './ReturnHomeButton.jsx';

function ElectionTitle({ title }) {
  return (
    <h1>{title}</h1>
  );
}

export default class Election extends React.Component {
  // TODO: Move error to distinc class/function
  unregisterdVoterErrorTitle = 'Unregistered public key'

  unregisterdVoterErrorMessage = 'Sorry but your public key was not recognized'

  userHasAlreadyVotedErrorTitle = 'Thank you for voting!'

  userHasAlreadyVotedErrorMessage =
    'You have already voted so you unable to see the list of candites right now. Wait please for the final results publication'

  constructor(props) {
    super(props);
    const { match: { params: { electionID } } } = this.props;
    this.state = {
      electionState: '',
      electionID,
    };
  }

  componentDidMount() {
    this.setState({ electionState: 'connectingToBlockchain' });
    const onFailure = () => {
      // TODO: add a new flag for the problem
      this.setState({ electionState: 'unregisteredUser' });
    };

    const { electionID } = this.state;

    const successfulConnectionConditions = [
      new ElectionAPI().isUserRegistered(electionID, onFailure),
      new ElectionAPI().hasUserAlreadyVoted(electionID, onFailure),
    ];

    // TODO: Error handling
    Promise.all(successfulConnectionConditions)
      .then((values) => {
        const isUserRegistered = values[0];
        const userVoted = values[1];

        if (!isUserRegistered) {
          this.setState({ electionState: 'unregisteredUser' });
        } else if (userVoted) {
          this.setState({ electionState: 'userHasAlreadyVoted' });
        } else {
          // TODO: BEtter error handling
          // TODO: Rename the getElection to getDeployedElection or getSmartContract
          new ElectionAPI()
            .getElection(electionID, onFailure)
            .then((election) => {
              console.log(election);

              this.setState({
                electionState: 'connectedToBlockchain',
                title: election.electionTitle,
                candidates: election.candidates,
              });
            })
            .catch(error => console.log(error));
        }
      })
      .catch((error) => {
        console.log('erro in first catch');
        console.log(error);
      });
  }

  render() {
    // TODO: The name valid is stupid change it
    // TODO: Handle the MetaMask error

    // TODO: Refactor the state, let it hold a flag indicating wether it is okay and not
    // move the messages to the reducer
    // TODO: Handle nulls for titile and candidates
    const {
      electionID, electionState, title, candidates,
    } = this.state;
    return (
      <>
        {electionState === 'unregisteredUser' && (
          <Card className="text-center">
            <Card.Header>
              <ErrorMessage
                messageTitle={this.unregisterdVoterErrorTitle}
                message={this.unregisterdVoterErrorMessage}
              />
            </Card.Header>
            <Card.Footer>
              <ReturnHomeButton />
            </Card.Footer>
          </Card>
        )}
        {electionState === 'connectingToBlockchain' && (
          <Card className="text-center">
            <Card.Header>
              <ElectionFetching />
            </Card.Header>
            <Card.Footer>
              <ReturnHomeButton />
            </Card.Footer>
          </Card>
        )}
        {electionState === 'connectedToBlockchain' && (
        <Card className="text-center">
          <Card.Header>
            <ElectionTitle title={title} />
          </Card.Header>
          <Card.Body>
            <CandidatesList electionID={electionID} candidates={candidates} />
          </Card.Body>
          <Card.Footer>
            <ReturnHomeButton />
          </Card.Footer>
        </Card>
        )}
        {electionState === 'userHasAlreadyVoted' && (
          <Card className="text-center">
            <Card.Header>
              <ErrorMessage
                messageTitle={this.userHasAlreadyVotedErrorTitle}
                message={this.userHasAlreadyVotedErrorMessage}
              />
            </Card.Header>
            <Card.Footer>
              <ReturnHomeButton />
            </Card.Footer>
          </Card>
        )}
      </>
    );
  }
}
