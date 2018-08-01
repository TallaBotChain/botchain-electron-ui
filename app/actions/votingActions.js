import CurationCouncil from '../blockchain/CurationCouncil';
import TokenVault from '../blockchain/TokenVault';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {BigNumber} from 'bignumber.js';
import * as DeveloperActions from '../actions/developerActions'
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';

export const VotingActions = {
  SET_VOTING_ATTRIBUTE: 'SET_VOTING_ATTRIBUTE',
  RESET_STATE: 'VOTING_RESET_STATE'
}

const setError = (error) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'error', value: error }
}

const setInProgress = (inProgress) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setRewardBalance = (balance) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'rewardBalance', value: balance }
}

const setVoteTxId = (txId) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxId', value: txId }
}

const setAvailableReward = (val) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'availableReward', value: val }
}

const getTotalSupply = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let totalSupply = await curationCouncil.getTotalSupply();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'totalSupply', value: totalSupply});
}

const getRewardRate = () => async (dispatch) => {
  let vault = new TokenVault();
  let rewardRate = await vault.curatorRewardRate();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'curatorRewardRate', value: vault.web3.utils.fromWei(rewardRate, 'ether') });
}

const getLastBlock = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let lastBlock = await curationCouncil.getLastBlock();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'lastBlock', value: lastBlock.number });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'lastBlockTimestamp', value: lastBlock.timestamp });
}

export const getVotes = () => async (dispatch, getStore) => {
  let curationCouncil = new CurationCouncil();
  dispatch(setInProgress(true));
  await dispatch(getTotalSupply());
  await dispatch(getRewardRate());
  await dispatch(getLastBlock());
  await dispatch(getPastTransactions());
  let { totalSupply, curatorRewardRate, lastBlock }  = getStore().voting;
  console.log("rewardRate: ",  curatorRewardRate );
  console.log("totalSupply: ", totalSupply);
  console.log("lastBlock: ", lastBlock);
  let votes = [];
  let availableReward = new BigNumber(0);
  for(let idx=totalSupply;idx>0;idx--) {
    let finalBlock = await curationCouncil.getVoteFinalBlock(idx);
    console.log("finalBlock: ", finalBlock);
    let expired = ( finalBlock < lastBlock );
    let votedOnStatus = await curationCouncil.getVotedOnStatus(idx);
    console.log("votedOnStatus for "+idx+" is ", votedOnStatus);
    let address = await curationCouncil.ownerOf(idx);
    dispatch(DeveloperActions.getDeveloperInfo(address));
    if( expired && (! votedOnStatus) ) continue; // skip expired and not voted
    votes.push( { key: idx,
      name: `Vote ${idx}`,
      reward: curatorRewardRate,
      address: address,
      votedOnStatus: votedOnStatus,
      expired: expired,
      finalBlock: finalBlock } );
    console.log(typeof curatorRewardRate);
    availableReward = availableReward.plus( BigNumber(curationCouncil.web3.utils.toWei(curatorRewardRate,'ether') ) );
  }
  dispatch( setAvailableReward(curationCouncil.web3.utils.fromWei(availableReward.toString(), 'ether') ) );
  dispatch( { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'votes', value: votes } );
  dispatch(setInProgress(false));
}

export const getRewardBalance = () => (dispatch) => {
  let vault = new TokenVault();
  vault.getRewardBalance().then((balance) => {
    dispatch(setRewardBalance( vault.web3.utils.fromWei(balance, 'ether') ));
  }, (error) => {
    console.log(error);
    dispatch(setRewardBalance(0));
    dispatch(setError(error));
  });
}


export const showVote = (vote) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteToShow', value: vote }
}

export const hideVote = () => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteToShow', value: null }
}

export const castVote = (idx, vote) => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  dispatch(setInProgress(true));
  try {
    var txId = await curationCouncil.castRegistrationVote(idx, vote);
    console.log("Casted vote, tx_id: ", txId);
    dispatch(setVoteTxId(txId));
    dispatch(startTxObserver(txId, castVoteTxMined));
  } catch( ex ) {
    console.log("Cast vote error: ", ex);
    dispatch(setError(ex.message));
    dispatch(setInProgress(false));
  }
}

const castVoteTxMined = (status) => (dispatch) => {
  dispatch(resetVoteState());
  dispatch(setInProgress(false))
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxMined', value: true });
  dispatch(getVotes());
  if(status == TxStatus.SUCCEED){
    dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteSuccess', value: true });
  } else {
    dispatch( setError("Vote transaction failed." ));
  }
}

export const resetVoteState = () => (dispatch) => {
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxMined', value: false });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxId', value: null });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteSuccess', value: false });
  dispatch(setError(null));
  dispatch(hideVote());
}

export const payoutReward = () => async (dispatch) => {
  let tokenVault = new TokenVault();
  dispatch(setInProgress(true));
  try {
    var txId = await tokenVault.collectCuratorReward();
    console.log("Collecting curator reward, tx_id: ", txId);
    dispatch(setPayoutTxId(txId));
    dispatch(startTxObserver(txId, payoutTxMined));
  } catch( ex ) {
    console.log("Collect curator reward error: ", ex);
    dispatch(setError(ex.message));
    dispatch(setInProgress(false));
  }
}

const payoutTxMined = (status) => (dispatch) => {
  dispatch(resetPayoutState());
  dispatch(setInProgress(false));
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxMined', value: true });
  dispatch(getRewardBalance());
  if(status == TxStatus.SUCCEED){
    dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutSuccess', value: true });
  } else {
    dispatch( setError("Reward collection failed." ));
  }
}

export const resetPayoutState = () => (dispatch) => {
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxMined', value: false });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxId', value: null });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutSuccess', value: false });
  dispatch(setError(null));
}

const setPayoutTxId = (txId) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxId', value: txId }
}

export const getPastTransactions = () => (dispatch) => {
  return axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      module: "account",
      action: "txlist",
      address: keyTools.address,
      sort: "desc",
      apikey: remote.getGlobal('config').etherscan_api_key
    }
  })
  .then(function (response) {
    dispatch(setPastVotes(response.data.result));
    return Promise.resolve();
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
    return Promise.resolve();
  })
}

const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))

const setPastVotes = (transactions) => {
  console.log("all transactions:", transactions);
  const contractAddress = remote.getGlobal('config').couration_council_contract;
  const castVoteMethod = "0x7e6a7282";
  let coucilTransactions = transactions.filter( tx => ( (tx.to == contractAddress) && (tx.isError == "0") && (tx.input.startsWith(castVoteMethod)) ) );
  console.log("council transactions:", coucilTransactions );
  let voteObjects = coucilTransactions.map( (tx) => {
    let voteId = parseInt(tx.input.substr(10,64));
    let voted = parseInt(tx.input.substring(75));
    return { voteId, voted };
  });
  console.log("past vote objects: ", voteObjects);
  let pastVotes = arrayToObject(voteObjects, "voteId");
  console.log("past votes: ", pastVotes);
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'pastVotes', value: pastVotes }
}
