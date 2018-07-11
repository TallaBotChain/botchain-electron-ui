import CurationCouncil from '../blockchain/CurationCouncil';
import TokenVault from '../blockchain/TokenVault';

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

const setAvailableReward = (val) => {
  return { type: VotingActions.SET_VOTING_ATTRIBUTE, key: 'availableReward', value: val }
}

export const getRewardBalance = () => (dispatch) => {
  dispatch(setInProgress(true));
  let vault = new TokenVault();
  vault.getRewardBalance().then((balance) => {
    dispatch(setRewardBalance(balance));
    dispatch(setInProgress(false));
  }, (error) => {
    console.log(error);
    dispatch(setRewardBalance(0));
    dispatch(setError(error));
    dispatch(setInProgress(true));
  });
}

export const getAvailableReward = () => (dispatch) => {
  dispatch(setInProgress(true));
  let council = new CurationCouncil();
  council.getAvailableReward().then((val) => {
    dispatch(setAvailableReward(val));
    dispatch(setInProgress(false));
  }, (error) => {
    console.log(error);
    dispatch(setAvailableReward(0));
    dispatch(setError(error));
    dispatch(setInProgress(true));
  });
}
