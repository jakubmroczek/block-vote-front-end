import React from 'react';
import {
  Button, Spinner, Container, Row, Col,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

import deploy from './deploy.js';

// TODO: Is this okay in the react?
const Web3 = require('web3');

export default class ElectionLobby extends React.Component {
  web3Provider = null;

  web3 = null;

  constructor(props) {
    super(props);

    this.state = {
      registeredUserNumber: '?',
    };

    this.read = this.read.bind(this);
    this.compileElectionSmartContract = this.compileElectionSmartContract.bind(this);
    this.deployElection = this.deployElection.bind(this);
    this.bytecodeObject = this.bytecodeObject.bind(this);
    this.abi = this.abi.bind(this);
    this.metaMaskInit = this.metaMaskInit.bind(this);
  }

  componentDidMount() {
    this.read();
    this.timer = setInterval(() => this.read(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // TODO: Keep this in a one place
  async read() {
    const query = `query 
    getUserElection {
      getUserElection  {
        publicKeys
      }
}`;

    const response = await graphQLFetch(query);

    if (response) {
      const { publicKeys } = response.getUserElection;
      this.setState({
        registeredUserNumber: publicKeys.length,
      });
    } else {
      alert('getUserElection call failed');
    }
  }

  async compileElectionSmartContract(onSuccessfulFetch) {
    const query = `mutation  
    compileElectionSmartContract {
      compileElectionSmartContract 
    }`;

    const { id } = this.props;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const getQuery = `query 
    getUserElection {
      getUserElection  {
        title
        candidates {
          name
          surname
        }
        publicKeys
        smartContract {
          bytecode
          abi
        } 
      }
}`;

      const getResponse = await graphQLFetch(getQuery);

      if (getResponse) {
        const {
          smartContract, title, candidates, publicKeys,
        } = getResponse.getUserElection;
        this.setState({
          smartContract, title, candidates, publicKeys,
        }, onSuccessfulFetch());
      } else {
        alert('getUserElection call failed');
      }
    } else {
      alert('compileElectionSmartContract call failed');
    }
  }

  // TODO: Move to the state
  bytecodeObject() {
    const { smartContract } = this.state;
    const { bytecode } = smartContract;
    const { object } = JSON.parse(bytecode);
    return `0x${object}`;
  }

  // TODO: Move to the state
  abi() {
    const { smartContract } = this.state;
    const { abi } = smartContract;
    const result = JSON.parse(abi);
    return result;
  }

  async update(address) {
    // TODO: Do not resend ABI, change it on the backend.
    // TODO: fetch something meaningful from the backen
    const query = `mutation 
        updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
          updateElection(id: $id, changes: $changes) {
                  title
                }
    }`;
    const { id } = this.props;

    // TODO: Do not do this, change backend logic
    const { smartContract: sm } = this.state;
    const { bytecode, abi } = sm;

    const smartContract = { address, bytecode, abi };
    const changes = { status: 'Deployed', smartContract };
    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      alert('Successful deployment!!');
    } else {
      alert('Could deploy the smart contract}');
    }
  }

  async metaMaskInit() {
    // TODO: What does Modern means?
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        // TODO: Beter error handling
        console.error('User denied account access');
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.web3Provider = window.web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // TODO: This should be removed from production code
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    this.web3 = new Web3(this.web3Provider);
  }

  async deployElection() {
    const onSuccessfulFetch = () => {
      this.metaMaskInit().then(() => {
        const account = window.web3.eth.defaultAccount;

        const bytecode = this.bytecodeObject();
        const abi = this.abi();
        const { title, candidates, publicKeys } = this.state;

        deploy(bytecode, abi, title, candidates, publicKeys, account, this.web3)
          .then((newContractInstance) => {
            const contractAddress = newContractInstance.options.address;
            this.update(contractAddress);
          }).error((err) => {
            console.log(err);
          });
      });
    };

    this.compileElectionSmartContract(onSuccessfulFetch);
  }

  render() {
    const { registeredUserNumber } = this.state;
    const { totalNumberOfVoters } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <Spinner animation="border" />
          </Col>
        </Row>
        <Row>
          Registered users
          {' '}
          {registeredUserNumber}
          /
          {totalNumberOfVoters}
        </Row>
        <Row>
          <Col>
            <Button onClick={this.deployElection}>
              Deploy election on blockchain
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
