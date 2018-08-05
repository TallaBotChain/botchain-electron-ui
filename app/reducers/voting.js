import { VotingActions } from '../actions/votingActions'

import update from 'immutability-helper';

const initialState = {
  error: null,
  inProgress: false,
  rewardBalance: null,
  availableReward: null,
  votes: [],
  pastVotes: {},
  totalSupply: null,
  curatorRewardRate: null,
  lastBlock: null,
  voteToShow: null,
  voteTxId: null,
  voteTxMined: false,
  voteSuccess: false,
  payoutTxId: null,
  payoutTxMined: false,
  payoutSuccess: false,
  ethereumBlocktime: 15 // average
}

const voting = (state = initialState, action) => {
  switch (action.type) {
  case VotingActions.SET_VOTING_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case VotingActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default voting
