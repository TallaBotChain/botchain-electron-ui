import CurationCouncil from '../blockchain/CurationCouncil';
import TokenVault from '../blockchain/TokenVault';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {BigNumber} from 'bignumber.js';
import * as DeveloperActions from '../actions/developerActions'
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';

const GET_VOTES_INTERVAL_MS = 20000;

export const VotingActions = {
  SET_VOTING_ATTRIBUTE: 'SET_VOTING_ATTRIBUTE',
  RESET_STATE: 'VOTING_RESET_STATE'
}

/** Sets error
 * @param error - error string
 **/
const setError = (error) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'error', value: error }
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets current reward balance
 * @param balance - balance in ERC20 tokens
 **/
const setRewardBalance = (balance) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'rewardBalance', value: balance }
}

/** Sets vote transaction id
 * @param txId - transaction hash
 **/
const setVoteTxId = (txId) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxId', value: txId }
}

/** Sets available reward in tokens
 * @param val - amount of tokens
 **/
const setAvailableReward = (val) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'availableReward', value: val }
}

/** Gets count of votes in Curation Council smart contract */
const getTotalSupply = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let totalSupply = await curationCouncil.totalVotes();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'totalSupply', value: totalSupply});
}

/** Gets current reward rate */
const getRewardRate = () => async (dispatch) => {
  let vault = new TokenVault();
  let rewardRate = await vault.curatorRewardRate();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'curatorRewardRate', value: vault.web3.utils.fromWei(rewardRate, 'ether') });
}

/** Gets last block information - number and timestamp */
const getLastBlock = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let lastBlock = await curationCouncil.getLastBlock();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'lastBlock', value: lastBlock.number });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'lastBlockTimestamp', value: lastBlock.timestamp });
}

/** Gets block height when user joined Curation Council */
const getJoinedCouncilBlockHeight = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let joinedHeight = parseInt(await curationCouncil.getJoinedCouncilBlockHeight());
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'joinedHeight', value: joinedHeight });
}

/** Gets list of votes
 * @param shouldSetInProgress - true to set in progress, false to process silently
 **/
export const getVotes = (shouldSetInProgress = true) => async (dispatch, getStore) => {
  let curationCouncil = new CurationCouncil();
  if( shouldSetInProgress) dispatch(setInProgress(true));
  await dispatch(getTotalSupply());
  await dispatch(getRewardRate());
  await dispatch(getLastBlock());
  await dispatch(getPastTransactions());
  await dispatch(getJoinedCouncilBlockHeight());
  let { totalSupply, curatorRewardRate, lastBlock, votes, updateInterval, joinedHeight }  = getStore().voting;
  console.log("rewardRate: ",  curatorRewardRate );
  console.log("totalSupply: ", totalSupply);
  console.log("lastBlock: ", lastBlock);
  let availableReward = new BigNumber(0);
  let lastVoteKey = Math.max.apply(Math, votes.map(function(o) { return o.key; }));
  lastVoteKey = Math.max( lastVoteKey, 0);
  console.log("last vote key: ", lastVoteKey);
  for(let idx=totalSupply;idx>lastVoteKey;idx--) {
    let initialBlock = await curationCouncil.getVoteInitialBlock(idx);
    console.log("initialBlock: ", initialBlock);
    let initialBlockInfo = await keyTools.web3.eth.getBlock(initialBlock);
    let finalBlock = await curationCouncil.getVoteFinalBlock(idx);
    console.log("finalBlock: ", finalBlock);
    let expired = ( finalBlock < lastBlock );
    let votedOnStatus = await curationCouncil.getVotedOnStatus(idx);
    let address = await curationCouncil.getRegistrationVoteAddressById(idx);
    await dispatch(DeveloperActions.getDeveloperInfo(address));
    let approvalStatus = getStore().developer.records[address].approvalStatus;
    if( joinedHeight >= initialBlock ) continue; // skip votes created before user joined council
    if( expired && (! votedOnStatus) ) continue; // skip expired and not voted
    if( approvalStatus && (! votedOnStatus) ) continue; // skip already approved

    votes.push( { key: idx,
      name: `Vote ${idx}`,
      reward: curatorRewardRate,
      address: address,
      votedOnStatus: votedOnStatus,
      expired: expired,
      initialBlock: initialBlock,
      initialTs: initialBlockInfo.timestamp,
      finalBlock: finalBlock } );
  }
  if( curatorRewardRate ) {
    availableReward = curationCouncil.web3.utils.toWei((curatorRewardRate * votes.filter((v)=>(!v.votedOnStatus && !v.expired)).length).toFixed(18).toString());
    dispatch( setAvailableReward( curationCouncil.web3.utils.fromWei(availableReward) ) );
  }
  votes.sort( (a,b) => {
    if( a.votedOnStatus && (!b.votedOnStatus) ) return 1;
    if( b.votedOnStatus && (!a.votedOnStatus) ) return -1;
    return (b.key - a.key);
  });
  dispatch( { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'votes', value: votes } );
  if( shouldSetInProgress ) dispatch(setInProgress(false));
  if( !updateInterval) {
    updateInterval = setInterval( () => {
      dispatch( getVotes(false) );
    }, GET_VOTES_INTERVAL_MS );
    dispatch( { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'updateInterval', value: updateInterval } );
  }
}

/** Marks vote voted
 * @param idx - integer index in CourationCouncil
 **/
const markVoted = (idx) => (dispatch, getState) => {
  let votes = getState().voting.votes;
  for(let i=0;i<votes.length;i++) {
    if(votes[i].key == idx) {
      votes[i].votedOnStatus = true;
    }
  }
  dispatch( { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'votes', value: votes } );
  dispatch( getVotes(false) );
}

/** Gets reward balance available for withdrawal */
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

/** Shows vote to user
 * @param vote - vote object to show
 **/
export const showVote = (vote) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteToShow', value: vote }
}

/** Hides previously shown vote from user */
export const hideVote = () => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteToShow', value: null }
}

/** Estimate gas for castVote transaction
 * @param idx - vote integer index
 * @param vote - true for Yay, false for Nay
 **/
export const castVoteEstGas = (idx, vote) => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  try {
    var voteGas = await curationCouncil.castRegistrationVoteEstGas(idx, vote);
    let gasFee = curationCouncil.web3.utils.fromWei((voteGas*curationCouncil.gasPrice).toString())
    dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxEstGas', value: gasFee });

  } catch( ex ) {
    console.log("Cast vote estimate gas: ", ex);
  }
}

/** Perform castVote transaction
 * @param idx - vote integer index
 * @param vote - true for Yay, false for Nay
 **/
export const castVote = (idx, vote) => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  try {
    console.log("Casting vote: ",idx,vote);
    var txId = await curationCouncil.castRegistrationVote(idx, vote);
    console.log("Casted vote, tx_id: ", txId);
    dispatch(addPastVote(idx, vote, txId));
    dispatch(setVoteTxId(txId));
    dispatch(startTxObserver(txId, castVoteTxMined(idx) ));
  } catch( ex ) {
    console.log("Cast vote error: ", ex);
    dispatch(setError(ex.message));
  }
}

/** Adds past vote object to storage
 * @param idx - vote index
 * @param vote - vote object
 * @param txId - vote transaction hash
 **/
const addPastVote = (idx, vote, txId) => (dispatch, getState) => {
  let pastVotes = getState().voting.pastVotes;
  pastVotes[idx] = { voteId: idx, voted: vote, txId: txId, mined: false, timestamp: (Date.now() / 1000) };
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'pastVotes', value: pastVotes }
}

/** Updates past vote mined status
 * @param idx - vote index
 * @param mined - true/false
 **/
const alterPastVote = (idx, mined) => (dispatch, getState) => {
  let pastVotes = getState().voting.pastVotes;
  pastVotes[idx].mined = mined;
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'pastVotes', value: pastVotes }
}

/** Processes castVote mined transaction */
const castVoteTxMined = (idx) => (status) => (dispatch, getState) => {
  console.log("castVoteTxrMined: ", idx);
  dispatch(resetVoteState());
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch( alterPastVote(idx, true) );
    dispatch( markVoted(idx) );
    dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteSuccess', value: true });
    dispatch( getRewardBalance() );
  } else {
    dispatch( setError("Vote transaction failed." ));
  }
}

/** Resets storage state */
export const resetVoteState = () => (dispatch) => {
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxMined', value: false });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteTxId', value: null });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'voteSuccess', value: false });
  dispatch(setError(null));
}

/** Estimates gas for reward payout */
export const payoutRewardEstGas = () => async (dispatch) => {
  try {
    let tokenVault = new TokenVault();
    var rewardGas = await tokenVault.collectCuratorRewardEstGas();
    let gasFee = tokenVault.web3.utils.fromWei((rewardGas*tokenVault.gasPrice).toString())
    dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxEstGas', value: gasFee });
  } catch(e) {
    console.log(e)
    dispatch( setError( "Failed to estimate gas." ));
  }
}

/** Performs reward payout */
export const payoutReward = () => async (dispatch) => {
  dispatch(resetPayoutState());
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

/** Processes mined payout transaction */
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

/** Resets payout transaction state */
export const resetPayoutState = () => (dispatch) => {
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxMined', value: false });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxId', value: null });
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutSuccess', value: false });
  dispatch(setError(null));
}

/** Sets payout transaction hash
 * @param txId - transaction hash
 * */
const setPayoutTxId = (txId) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'payoutTxId', value: txId }
}

/** Retrieves past transactions from etherscan */
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

/** Utility function to transform array to object */
const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))

/** Sets array of past votes
 * @param transactions - array of transactions
 **/
const setPastVotes = (transactions) => (dispatch, getState) => {
  let prevPastVotes = getState().voting.pastVotes;
  let curationCouncil = new CurationCouncil();
  console.log("all transactions:", transactions);
  const contractAddress = remote.getGlobal('config').curation_council_contract;
  const castVoteMethod = curationCouncil.getMethodSignature("castRegistrationVote");
  let coucilTransactions = transactions.filter( tx => ( (tx.to == contractAddress) && (tx.isError == "0") && (tx.input.startsWith(castVoteMethod)) ) );
  console.log("council transactions:", coucilTransactions );
  let voteObjects = coucilTransactions.map( (tx) => {
    let voteId = parseInt(tx.input.substr(10,64), 16);
    let voted = parseInt(tx.input.substring(75), 16);
    let txId = tx.hash;
    let mined = true;
    let timestamp = tx.timeStamp;
    return { voteId, voted, txId, mined, timestamp };
  });
  console.log("past vote objects: ", voteObjects);
  let nextPastVotes = arrayToObject(voteObjects, "voteId");
  let pastVotes = Object.assign(prevPastVotes, nextPastVotes);
  console.log("past votes: ", pastVotes);
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'pastVotes', value: pastVotes }
}
