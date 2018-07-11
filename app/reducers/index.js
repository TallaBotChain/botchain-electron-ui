// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import wallet from './wallet';
import voting from './voting';
import ethereum from './ethereum';
import botcoin from './botcoin';
import { reducer as form } from 'redux-form'
const rootReducer = combineReducers({
  form,
  wallet,
  voting,
  ethereum,
  botcoin,
  router
});

export default rootReducer;
