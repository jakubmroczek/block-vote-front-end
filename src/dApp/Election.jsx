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
      this.setState({ electionState: 'unregisteredUser' });
    };

    const { electionID } = this.state;

    const successfulConnectionConditions = [
      new ElectionAPI().isUserRegistered(electionID, onFailure),
      new ElectionAPI().hasUserAlreadyVoted(electionID, onFailure),
    ];

    Promise.all(successfulConnectionConditions)
      .then((values) => {
        const isUserRegistered = values[0];
        const userVoted = values[1];

        if (!isUserRegistered) {
          this.setState({ electionState: 'unregisteredUser' });
        } else if (userVoted) {
          this.setState({ electionState: 'userHasAlreadyVoted' });
        } else {
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
