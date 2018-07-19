import CurationCouncil from '../blockchain/CurationCouncil';
import TokenVault from '../blockchain/TokenVault';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'

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
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'curatorRewardRate', value: parseInt(rewardRate) });
}

const getLastBlock = () => async (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let lastBlock = await curationCouncil.getLastBlock();
  dispatch({ type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'lastBlock', value: lastBlock.number });
}

export const getVotes = () => async (dispatch, getStore) => {
  let curationCouncil = new CurationCouncil();
  dispatch(setInProgress(true));
  await dispatch(getTotalSupply());
  await dispatch(getRewardRate());
  await dispatch(getLastBlock());
  let { totalSupply, curatorRewardRate, lastBlock }  = getStore().voting;
  console.log("rewardRate: ",  curatorRewardRate );
  console.log("totalSupply: ", totalSupply);
  console.log("lastBlock: ", lastBlock);
  let votes = [];
  let availableReward = 0;
  for(let idx=totalSupply;idx>0;idx--) {
    let finalBlock = await curationCouncil.getVoteFinalBlock(idx);
    console.log("finalBlock: ", finalBlock);
    if( finalBlock < lastBlock ) break;
    let votedOnStatus = await curationCouncil.getVotedOnStatus(idx);
    console.log("votedOnStatus for "+idx+" is ", votedOnStatus);
    if( votedOnStatus ) continue; // skip already voted
    let address = await curationCouncil.ownerOf(idx);
    votes.push( { key: idx,
      name: `Vote ${idx}`,
      reward: curatorRewardRate,
      address: address } );
    availableReward += curatorRewardRate;
  }
  dispatch( setAvailableReward(availableReward) );
  dispatch( { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'votes', value: votes } );
  dispatch(setInProgress(false));
}

export const getRewardBalance = () => (dispatch) => {
  let vault = new TokenVault();
  vault.getRewardBalance().then((balance) => {
    dispatch(setRewardBalance(balance));
  }, (error) => {
    console.log(error);
    dispatch(setRewardBalance(0));
    dispatch(setError(error));
  });
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
}
