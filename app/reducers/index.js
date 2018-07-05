// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import wallet from './wallet';
import ethereum from './ethereum';
import { reducer as form } from 'redux-form'
const rootReducer = combineReducers({
  form,
  wallet,
  ethereum,
  router
});

export default rootReducer;
