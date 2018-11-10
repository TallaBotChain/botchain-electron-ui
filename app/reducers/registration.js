import { RegistrationActions } from '../actions/registrationActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  data: null
}

/** Registration reducer */
const registration = (state = initialState, action) => {
  switch (action.type) {
    case RegistrationActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
    case RegistrationActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default registration
