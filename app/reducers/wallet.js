import { WalletActions } from '../actions/walletActions.js'
import { SharedActions } from '../actions/sharedActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  tokenBalance: 0,
  mnemonic: null
}

/** Wallet reducer */
const wallet = (state = initialState, action) => {
  switch (action.type) {
  case WalletActions.SET_WALLET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case WalletActions.RESET_STATE:
  case SharedActions.RESET_APP:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default wallet
