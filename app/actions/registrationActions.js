import { reset } from 'redux-form';
import { push } from "react-router-redux";

export const RegistrationActions = {
  SET_ATTRIBUTE: 'SET_REGISTRATION_ATTRIBUTE',
  RESET_STATE: 'REGISTRATION_RESET_STATE'
}

export const saveRegistration = (values) => (dispatch) => {
  dispatch({ type: RegistrationActions.SET_ATTRIBUTE, key: 'data', value: values })
  //TODO remove localStorage saving
  localStorage.setItem('registration', JSON.stringify(values));
  dispatch(reset('registration'));
  dispatch(redirectNext())
}

export const redirectNext = () => (dispatch) => {
  dispatch(push('/wallet/new'));
}


export const setError = (error) => {
  return { type: RegistrationActions.SET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: RegistrationActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}