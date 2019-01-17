import { BotcoinActions } from '../actions/botcoinActions.js'
import { SharedActions } from '../actions/sharedActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  balance: 0,
  transferTxEstGas: 0,
  transferTxId: null,
  transferTxMined: false,
  transferSuccess: false,
  transactions: [],
  currency: "BOT",
  usdExchangeRate: 0
}

/** Botcoin reducer */
const botcoin = (state = initialState, action) => {
  switch (action.type) {
  case BotcoinActions.SET_BOTCOIN_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case BotcoinActions.RESET_STATE:
  case SharedActions.RESET_APP:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default botcoin
