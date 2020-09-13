import Web3 from 'web3';
import graphQLFetch from '../graphQLFetch.js';

export default class ElectionAPI {
  web3Provider = null;

  web3 = null;

  electionInstance = null;

  async metaMaskInit() {
    // Modern dapp browsers
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
      throw Error('MetaMask plugin not found in browser.');
    }
    this.web3 = new Web3(this.web3Provider);
  }

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

  async blockchainInit(response) {
    const { smartContract } = response;
    const { abi, address } = smartContract;
    const contractABI = JSON.parse(abi);

    const dapptokenContract = new this.web3.eth.Contract(contractABI, address);
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

    const candidates = this.electionInstance.methods.getCandidates().call();

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

  async getNumberOfCastedVotes(id) {
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    return this.electionInstance.methods.getNumberOfCastedVotes().call(result => result);
  }

  async getNumberOfEligibleVoters(id) {
     await this.metaMaskInit();
     const response = await this.fetchCompiledSmartContract(id);
 
     if (response === undefined) {
       onFailure();
       return;
     }
 
     await this.blockchainInit(response);
 
     return this.electionInstance.methods.getNumberOfEligibleVoters().call(result => result);
  }

  async vote(id, candidate) {
    await this.metaMaskInit();
    const publicKey = window.web3.eth.defaultAccount;
    const response = await this.fetchCompiledSmartContract(id);
    await this.blockchainInit(response);

    return this.electionInstance.methods.vote(candidate.index).send({ from: publicKey })
      .catch(error => console.log(error));
  }

  async isUserRegistered(id, onFailure) {
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    return this.electionInstance.methods.isVoterRegistered(window.web3.eth.defaultAccount).call(result => result);
  }

  async hasUserAlreadyVoted(id, onFailure) {
    await this.metaMaskInit();
    const response = await this.fetchCompiledSmartContract(id);

    if (response === undefined) {
      onFailure();
      return;
    }

    await this.blockchainInit(response);

    return this.electionInstance.methods.hasVoterAlreadyVoted(window.web3.eth.defaultAccount).call()
      .then(res => res);
  }
}
