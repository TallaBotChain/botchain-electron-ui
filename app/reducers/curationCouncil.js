import { CurationCouncilActions } from '../actions/curationCouncilActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  stakedBalance: 0,
  joinTxEstGas: 0,
  joinTxId: null,
  joinTxMined: false,
  joinSuccess: false,
  leaveTxEstGas: 0,
  leaveTxId: null,
  leaveTxMined: false,
  leaveSuccess: false
}

const curationCouncil = (state = initialState, action) => {
  switch (action.type) {
  case CurationCouncilActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case CurationCouncilActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default curationCouncil
