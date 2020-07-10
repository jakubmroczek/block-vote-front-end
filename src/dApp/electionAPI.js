import Web3 from 'web3';
import graphQLFetch from '../graphQLFetch.js';

export default class ElectionAPI {
  web3Provider = null;

  web3 = null;

  electionInstance = null;

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
      throw Error('MetaMask plugin not found in browser.');
    }
    this.web3 = new Web3(this.web3Provider);
  }

  // TODO: Make this dependant on the public key
  // eslint-disable-next-line class-methods-use-this
  async fetchCompiledSmartContract(id) {
    const query = `query 
    getVoterElection($id: ID!) {
      getVoterElection(id: $id) {
        smartContract {
          abi
          address
        }
      }
    }`;

    const response = await graphQLFetch(query, { id });

    if (response) {
      return response.getVoterElection;
    }

    return undefined;
  }

  // TODO: Better describtion response from the backend
  async blockchainInit(response) {
    const { smartContract } = response;
    const { abi, address } = smartContract;
    const contractABI = JSON.parse(abi);

    // TODO: Get this from the metamask
    const web3 = new Web3('http://localhost:8545');

    const dapptokenContract = new web3.eth.Contract(contractABI, address);
    this.electionInstance = dapptokenContract;
  }

  async getUserPublicKey() {
    await this.metaMaskInit();
    return window.web3.eth.defaultAccount;
  }

  async getElection(id, onFailure) {
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    // TODO: Error handling
    // TOOD: rename to promise
    const candidates = this.electionInstance.methods.getCandidates().call();

    // TODO: Error handling
    const electionTitle = this.electionInstance.methods.getTitle().call();

    return Promise.all([candidates, electionTitle])
      .then((values) => {
        const candidates = [];
        for (let i = 0; i < values[0].length; i += 1) {
          candidates.push(
            {
              name: values[0][i].name,
              surname: values[0][i].surname,
              index: i,
            },
          );
        }

        return {
          candidates,
          electionTitle: values[1],
        };
      });
  }

  async vote(id, candidate) {
    // TODO: Encapsulate this in a function and call only once
    await this.metaMaskInit();
    const publicKey = window.web3.eth.defaultAccount;
    const response = await this.fetchCompiledSmartContract(id);
    await this.blockchainInit(response);

    return this.electionInstance.methods.vote(candidate.index).send({ from: publicKey })
      .catch(error => console.log(error));
  }

  async isUserRegistered(id, onFailure) {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    // TODO: Rename the function in the blockchain
    return this.electionInstance.methods.isVoterRegistered(window.web3.eth.defaultAccount).call(result => result);
  }

  async hasUserAlreadyVoted(id, onFailure) {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    // TODO: Rename the function in the blockchain
    return this.electionInstance.methods.hasVoterAlreadyVoted(window.web3.eth.defaultAccount).call()
      .then(res => res);
  }
}
