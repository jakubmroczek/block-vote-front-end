import React from 'react';
import {
  Button, Spinner, Container, Row, Col,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

import deploy from './deploy.js';

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

  bytecodeObject() {
    const { smartContract } = this.state;
    const { bytecode } = smartContract;
    const { object } = JSON.parse(bytecode);
    return `0x${object}`;
  }

  abi() {
    const { smartContract } = this.state;
    const { abi } = smartContract;
    const result = JSON.parse(abi);
    return result;
  }

  async startElection(address) {
    const query = `mutation 
    startElection($address: String!) {
      startElection(address: $address) 
    }`;
    const data = await graphQLFetch(query, { address });

    if (data) {
      const { callback } = this.props;
      callback();
    } else {
      alert('Could not deploy the smart contract on the blockchain');
    }
  }

  async metaMaskInit() {
    if (window.ethereum) {
      this.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error('User denied account access');
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.web3Provider = window.web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
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
            this.startElection(contractAddress);
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
      <Container className="mt-3 text-center">
         <Row className="mt-3 text-centre" style={{ fontSize: 20 }}>
          <Col>
            Registered users
            {' '}
            {registeredUserNumber}
            /
            {totalNumberOfVoters}
          </Col>
        </Row>
         <Row className="mt-3">
          <Col>
            <Spinner animation="border" />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Button onClick={this.deployElection} variant="outline-success">
              Start the election
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
