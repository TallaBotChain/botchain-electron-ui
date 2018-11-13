import { DeveloperActions } from '../actions/developerActions'

import update from 'immutability-helper';

const initialState = {
  error: null,
  inProgress: false,
  records: {}
}

/** Developer reducer */
const developer = (state = initialState, action) => {
  switch (action.type) {
  case DeveloperActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case DeveloperActions.SET_DEVELOPER_ATTRIBUTE:
      return update(state, { records: {[action.address]: {[action.key]: {$set: action.value}}}});
  case DeveloperActions.APPEND:
      return update(state, { records: {$merge: action.developer}});
  case DeveloperActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default developer
