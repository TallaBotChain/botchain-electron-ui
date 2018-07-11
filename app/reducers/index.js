// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import wallet from './wallet';
import voting from './voting';
import { reducer as form } from 'redux-form'
const rootReducer = combineReducers({
  form,
  wallet,
  voting,
  router
});

export default rootReducer;
