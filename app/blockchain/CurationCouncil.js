import BaseConnector from './BaseConnector'
import artifact from './abi/CurationCouncilRegistryDelegate.json'
import {remote} from 'electron';

export default class CurationCouncil extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').curation_council_contract);
  }

  /** Gets min stake amount from smart contract
   * @returns Promise
   **/
  getMinStake() {
    return this.contract.methods.getMinStake().call({from: this.account});
  }

  /** Gets block height when user joined curation council
   * @returns Promise
   **/
  getJoinedCouncilBlockHeight() {
    return this.contract.methods.getJoinedCouncilBlockHeight(this.account).call({from: this.account});
  }

  /** Estimates gas for joinCouncil contract call
   * @param stake - amount of BOT to stake
   **/
  joinCouncilEstGas(stake) {
    return this.contract.methods.joinCouncil(this.web3.utils.toWei(stake.toString(), "ether")).estimateGas({from: this.account})
  }

  /** Sends joinCouncil contract transaction
   * @param stake - amount of BOT to stake
   **/
  joinCouncil(stake) {
    return this.contract.methods.joinCouncil(this.web3.utils.toWei(stake.toString(), "ether")).estimateGas({from: this.account}).then((gas) => {
      return new Promise((resolve, reject) => {
        this.contract.methods.joinCouncil(this.web3.utils.toWei(stake.toString(), "ether"))
        .send({gasPrice: this.gasPrice, from: this.account, gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }

  /** Estimates gas for leaveCouncil contract call
   **/
  leaveCouncilEstGas() {
    return this.contract.methods.leaveCouncil().estimateGas({from: this.account})
  }

  /** Performs leaveCouncil transaction */
  leaveCouncil() {
    return this.contract.methods.leaveCouncil().estimateGas({from: this.account}).then((gas) => {
      return new Promise((resolve, reject) => {
        this.contract.methods.leaveCouncil()
        .send({gasPrice: this.gasPrice, from: this.account, gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }

  /** Gets amount BOT tokens staked */
  getStakedBalance() {
    return this.contract.methods.getStakeAmount(this.account).call({from: this.account});
  }

  /** Gets total number of votes */
  totalVotes() {
    return this.contract.methods.totalVotes().call({from: this.account});
  }

  /** Gets vote address by id
   * @param idx - vote index
   **/
  getRegistrationVoteAddressById(idx) {
    return this.contract.methods.getRegistrationVoteAddressById(idx).call({from: this.account});
  }

  /** Gets last block information */
  getLastBlock() {
    return this.web3.eth.getBlock('latest');
  }

  /** Gets block nubmer when voting ends for vote with index
   * @param idx - vote index
   **/
  getVoteFinalBlock(idx) {
    return this.contract.methods.getVoteFinalBlock(idx).call({from: this.account});
  }

  /** Gets block nubmer when voting starts for vote with index
   * @param idx - vote index
   **/
  getVoteInitialBlock(idx) {
    return this.contract.methods.getVoteInitialBlock(idx).call({from: this.account});
  }

  /** Gets voted status for vote with index
   * @param idx - vote index
   * @returns Promise - true if already voted
   **/
  getVotedOnStatus(idx) {
    return this.contract.methods.getVotedOnStatus(idx, this.account).call({from: this.account});
  }

  /** Estimates transaction gas to cast a vote
   * @param idx - vote index
   * @param vote - true/false for Yay/Nay
   **/
  castRegistrationVoteEstGas(idx, vote) {
    return this.contract.methods.castRegistrationVote(idx, vote).estimateGas({from: this.account})
  }

  /** Sends transaction to cast a vote
   * @param idx - vote index
   * @param vote - true/false for Yay/Nay
   **/
  castRegistrationVote(idx, vote) {
    return this.contract.methods.castRegistrationVote(idx, vote).estimateGas({from: this.account}).then( (gas) => {
      return new Promise( (resolve, reject) => {
        console.log("castRegistrationVote ",idx,vote);
        this.contract.methods.castRegistrationVote(idx, vote)
          .send({gasPrice: this.gasPrice, from: this.account, gas: gas},
            (err, tx_id) => {
              if (!err) {
                console.log("cast vote tx_id:", tx_id);
                resolve(tx_id);
              }
            }
          ).catch((err) => {
            reject(err);
          });
      });
    });
  }
}
