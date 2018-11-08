import { reset } from 'redux-form';
import { push } from "react-router-redux";

export const RegistrationActions = {
  SET_ATTRIBUTE: 'SET_REGISTRATION_ATTRIBUTE',
  RESET_STATE: 'REGISTRATION_RESET_STATE'
}

/** Saves registration info into localStorage
 * @param values - hash of values
 **/
export const saveRegistration = (values) => (dispatch) => {
  dispatch({ type: RegistrationActions.SET_ATTRIBUTE, key: 'data', value: values })
  //TODO remove localStorage saving
  localStorage.setItem('registration', JSON.stringify(values));
  dispatch(reset('registration'));
  dispatch(redirectNext())
}

/** Returns next location after registration */
export const redirectNext = () => (dispatch) => {
  dispatch(push('/wallet/new'));
}

/** Sets error
 * @param error - error string or array
 **/
export const setError = (error) => {
  return { type: RegistrationActions.SET_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: RegistrationActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}
