import DeveloperRegistry from '../blockchain/DeveloperRegistry';
import axios from 'axios'

export const DeveloperActions = {
  SET_ATTRIBUTE: 'SET_DEVELOPER_ATTRIBUTE',
  SET_DEVELOPER_ATTRIBUTE: 'SET_DEVELOPER_HASH_ATTRIBUTE',
  APPEND: "APPEND_DEVELOPER",
  RESET_STATE: 'DEVELOPER_RESET_STATE'
}

const setError = (error) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'error', value: error }
}

const setInProgress = (inProgress) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setDeveloperAttribute = (address, key, value) => {
  return { type: DeveloperActions.SET_DEVELOPER_ATTRIBUTE, address: address, key: key, value: value }
}

const appendDeveloper = (developer) => {
  return { type: DeveloperActions.APPEND, developer }
}

export const getDeveloperInfo = (address) => async (dispatch, getStore) => {
  dispatch(setInProgress(true));
  let developerRegistry = new DeveloperRegistry();
  try {
    let id = await developerRegistry.getDeveloperId(address)
    let url = await developerRegistry.getDeveloperUrl(id)
    let metadata = await getDeveloperMetadata(url)
    let developer = { [address]: { developerId: id, url: url, metadata: metadata} }
    dispatch(appendDeveloper(developer))
  } catch (e) {
    console.log(e);
    dispatch(setError("Failed to retreive developer info."));
  }
  dispatch(setInProgress(false));
}

const getDeveloperMetadata = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  });
}
