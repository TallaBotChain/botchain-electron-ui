import { EthereumActions } from '../actions/ethereumActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  balance: 0,
  transferTxId: null,
  transferTxMined: false,
  transferSuccess: false,
  transactions: [],
  currency: "ETH"
}

const ethereum = (state = initialState, action) => {
  switch (action.type) {
  case EthereumActions.SET_ETHEREUM_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case EthereumActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default ethereum
