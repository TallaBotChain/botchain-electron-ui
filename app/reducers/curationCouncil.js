import { CurationCouncilActions } from '../actions/curationCouncilActions.js'
import { SharedActions } from '../actions/sharedActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  stakedBalance: 0,
  joinTxEstGas: 0,
  leaveTxEstGas: 0,
  hasPendingTx: false,
  minStake: 0
}

/** Curation Council reducer */
const curationCouncil = (state = initialState, action) => {
  switch (action.type) {
  case CurationCouncilActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case CurationCouncilActions.RESET_STATE:
  case SharedActions.RESET_APP:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default curationCouncil
