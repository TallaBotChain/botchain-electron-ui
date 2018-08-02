import { BotcoinActions } from '../actions/botcoinActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  balance: 0,
  transferTxId: null,
  transferTxMined: false,
  transferSuccess: false,
  transactions: [],
  currency: "BOTC",
  usdExchangeRate: 0
}

const botcoin = (state = initialState, action) => {
  switch (action.type) {
  case BotcoinActions.SET_BOTCOIN_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case BotcoinActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default botcoin
