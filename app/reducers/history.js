import { HistoryActions } from '../actions/historyActions.js'
import { SharedActions } from '../actions/sharedActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  stake: [],
  ethereum: [],
  botcoin: [],
  stakeBlockId: 0,
  ethereumBlockId: 0,
  botcoinBlockId: 0,
  transactions: {}
}

/** Transaction histroy reducer */
const history = (state = initialState, action) => {
  switch (action.type) {
  case HistoryActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case HistoryActions.ADD_TRANSACTIONS:
      return update(state, {transactions: {$merge: action.value}});
  case HistoryActions.ADD_TO_INDEX:
      return update(state, {[action.key]: {$set: Array.from(new Set(action.value.concat(state[action.key])))} });
  case HistoryActions.REMOVE_FROM_INDEX:
      let new_index = state[action.key].filter(e => e !== action.value)
      return update(state, {[action.key]: {$set: new_index} });
  case HistoryActions.RESET_STATE:
  case SharedActions.RESET_APP:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default history
